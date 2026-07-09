import StudyNotesRepository from "@/repositories/studynotes.repository.js";
import SubjectRepository from "@/repositories/subject.repository.js";
import AiService from "./ai.service.js";
import roadmapPrompt from "@/utils/prompt/roadmap.prompt.js";
import IRoadmap from "@/@types/interface/roadmap.interface.js";
import RoadmapRepository from "@/repositories/roadmap.repositories.js";
import IStudynotes from "@/@types/interface/studynotes.interface.js";

class RoadMapService {
  public static async generateRoadMap(
    subject_id: string,
    {
      syllabus,
      notes,
      subject_name,
    }: {
      syllabus: IStudynotes | undefined;
      notes: IStudynotes[];
      subject_name: string;
    },
  ): Promise<void> {
    const syllabus_text = syllabus?.file_info?.text_data || "";
    console.log(syllabus_text);
    const roadmap: IRoadmap = (await AiService.json(
      roadmapPrompt({
        subject_name: subject_name as string,
        syllabus_text: syllabus_text as string,
      }),
    )) as IRoadmap;
    const roadmapWithSubjectId: IRoadmap = {
      ...roadmap,
      subject_id: subject_id as unknown as any,
    };
    console.log(roadmap);
    await RoadmapRepository.createRoadmap(roadmapWithSubjectId);
  }
}

export default RoadMapService;
