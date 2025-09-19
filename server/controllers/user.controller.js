import Creation from "../models/creation.model.js";

export const getUserCreations = async (req, res) => {
  try {
    
    const {userId} = req.auth();

   const creations = await Creation.find({user_id: userId}).sort({created_at: -1});

   return res.status(200).json({success: true, message:'Getting user creations successfully', creations})

  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
}



export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await Creation.find({ publish: true })
      .sort({ created_at: -1 }); // -1 for DESC order

    if (!creations) {
      return res.status(404).json({ success: false, message: "No creations found" });
    }

    return res.status(200).json({ success: true,message: "Getting published creations successfully", creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



export const toggleLikeCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const creation = await Creation.findById(id);

    if (!creation) {
      return res.status(404).json({ success: false, message: "No creation found" });
    }

    const userIdStr = userId.toString();
    let updatedLikes;
    let message;

    if (creation.likes.includes(userIdStr)) {
      // Unlike
      updatedLikes = creation.likes.filter((user) => user !== userIdStr);
      message = "Creation UnLiked";
    } else {
      // Like
      updatedLikes = [...creation.likes, userIdStr];
      message = "Creation Liked";
    }

    // Save updated likes as array (not string!)
    creation.likes = updatedLikes;
    await creation.save();

    res.json({ success: true, message, likes: updatedLikes });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
