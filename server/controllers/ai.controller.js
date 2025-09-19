import OpenAI from "openai";
import Creation from "../models/creation.model.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js';

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
  try {
    const {userId} = req.auth();
    const {prompt,length,type} = req.body;

    const plan = req.plan;
    const free_usage = req.free_usage;

    if(plan !== 'premium' && free_usage >= 10){
      return res.status(403).json({success: false, message: 'You have reached your free usage limit. Please upgrade to premium plan to continue.'})
    }

    const response = await AI.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
        {
            role: "user",
            content: prompt,
        },
    ],
    temperature: 0.7,
    max_tokens: length,
});

const content = response.choices[0].message.content;

const creation = await Creation.create({user_id: userId, prompt, content,type:'generate-article'});

if(plan !== 'premium'){
  await clerkClient.users.updateUserMetadata(userId, {privateMetadata:{
    free_usage: free_usage + 1
  }})
}

res.status(200).json({success: true, message: 'Article generated successfully',content})

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({success: false, message: error.message})
  }
}




export const generateBlogTitle = async (req, res) => {
  try {
    const {userId} = req.auth();
    const {prompt} = req.body;

    const plan = req.plan;
    const free_usage = req.free_usage;

    if(plan !== 'premium' && free_usage >= 10){
      return res.status(403).json({success: false, message: 'You have reached your free usage limit. Please upgrade to premium plan to continue.'})
    }

    const response = await AI.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
        {
            role: "user",
            content: prompt,
        },
    ],
    temperature: 0.7,
    max_tokens: 100,
});

const content = response.choices[0].message.content;

const creation = await Creation.create({user_id: userId, prompt, content,type:'blog_title'});

if(plan !== 'premium'){
  await clerkClient.users.updateUserMetadata(userId, {privateMetadata:{
    free_usage: free_usage + 1
  }})
}

res.status(200).json({success: true, message: 'Article generated successfully',content})

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({success: false, message: error.message})
  }
}



export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;

    const plan = req.plan;

    if (plan !== 'premium') {
      return res.status(403).json({
        success: false,
        message:
          'This feature is only available to premium users. Please upgrade to premium plan to continue.',
      });
    }

    const formData = new FormData();
    formData.append('prompt', prompt);

    const { data } = await axios.post(
      'https://clipdrop-api.co/text-to-image/v1',
      formData,
      {
        headers: {
          'x-api-key': process.env.CLIP_DROP_API_KEY,
        },
        responseType: 'arraybuffer',
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      'binary'
    ).toString('base64')}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    const creation = await Creation.create({
      user_id: userId,
      prompt,
      content: secure_url,
      type: 'image',
      publish,
    });

    res.status(200).json({
      success: true,
      message: 'Image generated successfully',
      content: secure_url,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};




export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;

    const plan = req.plan;

    if (plan !== 'premium') {
      return res.status(403).json({
        success: false,
        message:
          'This feature is only available to premium users. Please upgrade to premium plan to continue.',
      });
    }

   

    const { secure_url } = await cloudinary.uploader.upload(image.path,{transformation: [
      {
        effect: "background_removal",
        background_removal: 'remove_the_background',
      }
    ] });

    const creation = await Creation.create({
      user_id: userId,
      prompt: 'remove background from image',
      content: secure_url,
      type: 'image',
    });

    res.status(200).json({
      success: true,
      message: 'Image generated successfully',
      content: secure_url,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};






export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const { image } = req.file;

    const plan = req.plan;


    if (plan !== 'premium') {
      return res.status(403).json({
        success: false,
        message:
          'This feature is only available to premium users. Please upgrade to premium plan to continue.',
      });
    }

   

    const { public_id } = await cloudinary.uploader.upload(image.path);

   const imageUrl = cloudinary.url(public_id,{
      transformation: [
      {
        effect: `gen_remove:${object}`,}],
      resource_type: 'image'
    })

    const creation = await Creation.create({
      user_id: userId,
      prompt: `remove ${object} from image`,
      content: imageUrl,
      type: 'image',
    });

    res.status(200).json({
      success: true,
      message: 'Image generated successfully',
      content: imageUrl,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};





export const reviewResume = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume  = req.file;

    const plan = req.plan;

    if (plan !== 'premium') {
      return res.status(403).json({
        success: false,
        message:
          'This feature is only available to premium users. Please upgrade to premium plan to continue.',
      });
    }

    if(resume.size > 5 * 1024 * 1024){
      return res.status(400).json({success: false, message: 'Resume size should be less than 5MB'});
    }

    const dataBuffer =  fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}; `


     const response = await AI.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
        {
            role: "user",
            content: prompt,
        },
    ],
    temperature: 0.7,
    max_tokens: 1000,
});

const content = response.choices[0].message.content;
   
    const creation = await Creation.create({
      user_id: userId,
      prompt: 'Review the uploaded Resume',
      content: content,
      type: 'resume-review',
    });

    res.status(200).json({
      success: true,
      message: 'Image generated successfully',
      content: content,
    });

  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};