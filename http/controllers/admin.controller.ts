import User from "../models/user.model";

export const addAvatar = async (req: any, res: any) => {
    try {
        const username = req.user 
        if (!username) {
            return res.status(404).json({
                message: "User not authenticated",
                success: false,
            })
        }

        const user = await User.findOneAndUpdate(
            {username},
            { Avatar: req.body.imageUrl, AvatarName: req.body.name },
            { new: true },
        )

        if(!user) {
            return res.status(409).json({
                message: "User doesn't exist",
                success: false,
            })
        }
        
        return res.status(200).json({
            message: "Avatar updated successfully",
            success: true,
            user,
          });
    } catch (error) {
        console.log("Error in Adding avatar", error)
    }
}

