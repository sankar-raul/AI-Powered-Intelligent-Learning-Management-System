import IRoadmap from "@/@types/interface/roadmap.interface.js";
import RoadmapModel from "@/models/roadmap/roadmap.model.js";

class RoadmapRepository {
  public static async getRoadmapById(roadmapId: string) {
    try {
      const roadmap = await RoadmapModel.findById(roadmapId).exec();
      return roadmap;
    } catch (error) {
      console.error("Error fetching roadmap by ID:", error);
      throw error;
    }
  }
  public static async createRoadmap(roadmapData: IRoadmap) {
    try {
      const newRoadmap = new RoadmapModel(roadmapData);
      return await newRoadmap.save();
    } catch (error) {
      console.error("Error creating roadmap:", error);
      throw error;
    }
  }
  public static async updateRoadmap(
    roadmapId: string,
    updateData: Partial<IRoadmap>,
  ) {
    try {
      const updatedRoadmap = await RoadmapModel.findByIdAndUpdate(
        roadmapId,
        updateData,
        { new: true },
      ).exec();
      return updatedRoadmap;
    } catch (error) {
      console.error("Error updating roadmap:", error);
      throw error;
    }
  }
  public static async deleteRoadmap(roadmapId: string) {
    try {
      const deletedRoadmap =
        await RoadmapModel.findByIdAndDelete(roadmapId).exec();
      return deletedRoadmap;
    } catch (error) {
      console.error("Error deleting roadmap:", error);
      throw error;
    }
  }
  public static async getRoadmapsBySubjectId(subjectId: string) {
    try {
      const roadmaps = await RoadmapModel.find({
        subject_id: subjectId,
      }).exec();
      return roadmaps;
    } catch (error) {
      console.error("Error fetching roadmaps by subject ID:", error);
      throw error;
    }
  }
}

export default RoadmapRepository;
