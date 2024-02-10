import { Request, Response } from "express";
export const deleteOne = (Model: any) => async (req: Request, res: Response) => {
    try {
        const doc = await Model.findByIdAndDelete(req.params.id)
        if (!doc) {
            return res.status(404).json({
                status: "fail",
                msg: "No document found with that ID"
            })
        }
        res.status(200).json({
            status: "success",
            msg: "Document deleted successfully"
        })
    } catch (error: any) {
        res.status(400).json({
            status: "fail",
            msg: error.message
        })
    }
}