import { connectDB } from "@/config/dbConnection";
import Data from "@/models/Data";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;

  await connectDB();

  try {
    if (method === "GET") {
      const data = await Data.findById(id);
      if (!data) return res.status(404).json({ message: "Data not found" });
      res.status(200).json(data);
    } else if (method === "PUT") {
      const updatedData = await Data.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedData)
        return res.status(404).json({ message: "Data not found" });
      res.status(200).json(updatedData);
    } else if (method === "DELETE") {
      const deletedData = await Data.findByIdAndDelete(id);
      if (!deletedData)
        return res.status(404).json({ message: "Data not found" });
      res.status(200).json({ message: "Data deleted successfully" });
    } else {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
