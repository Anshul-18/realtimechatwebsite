import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        let sender = req.userId
        let {receiver} = req.params
        let {message} = req.body

        let image = null;
        let file = null;
        
        if (req.file) {
            const uploadedUrl = await uploadOnCloudinary(req.file.path);
            if (req.file.mimetype.startsWith('image/')) {
                image = uploadedUrl;
            } else {
                file = JSON.stringify({
                    url: uploadedUrl,
                    name: req.file.originalname,
                    type: req.file.mimetype
                });
            }
        }

        let newMessage = await Message.create({
            sender,
            receiver,
            message,
            image,
            file
        })

        let conversation=await Conversation.findOne({
            partcipants:{$all:[sender,receiver]}
        })

        if(!conversation){
            conversation=await Conversation.create({
                partcipants:[sender,receiver],
                messages:[newMessage._id]
            })
        }else{
            conversation.messages.push(newMessage._id)
            await conversation.save()
        }

        const receiverSocketId=getReceiverSocketId(receiver)
if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage",newMessage)
}


        
        return res.status(201).json(newMessage)
    
    } catch (error) {
        return res.status(500).json({message:`send Message error ${error}`})
    }
}

export const getMessages=async (req,res)=>{
    try {
        let sender=req.userId
        let {receiver}=req.params
        let conversation=await Conversation.findOne({
            partcipants:{$all:[sender,receiver]}
        }).populate("messages")

        return res.status(200).json(conversation?.messages)
    } catch (error) {
        return res.status(500).json({message:`get Message error ${error}`})
    }
}