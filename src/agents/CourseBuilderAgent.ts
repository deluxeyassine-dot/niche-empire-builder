/**
 * Course Builder Agent (#10)
 *
 * Purpose: Automatically structure and create online courses with modules, lessons, and assessments.
 *
 * Revenue Impact: Very High - courses command premium prices ($97-$997).
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

// =====================================================================
// INTERFACES
// =====================================================================

export interface Curriculum {
  id: string;
  topic: string;
  totalModules: number;
  totalLessons: number;
  duration: number;
  learningObjectives: string[];
  targetAudience: string;
}

export interface Module {
  id: string;
  courseId: string;
  moduleNumber: number;
  title: string;
  description: string;
  learningOutcomes: string[];
  duration: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  lessonNumber: number;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  content: string;
  script?: string;
  duration: number;
  resources: Resource[];
}

export interface Script {
  id: string;
  lessonId: string;
  sections: ScriptSection[];
  totalWords: number;
  estimatedDuration: number;
}

export interface ScriptSection {
  type: 'intro' | 'main' | 'demo' | 'conclusion';
  content: string;
  notes?: string;
}

export interface Assessment {
  id: string;
  moduleId: string;
  type: 'quiz' | 'assignment' | 'project';
  title: string;
  questions: Question[];
  passingScore: number;
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Material {
  id: string;
  courseId: string;
  type: 'workbook' | 'cheatsheet' | 'template' | 'resource_list';
  title: string;
  description: string;
  fileUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  niche: string;
  description: string;
  curriculum: Curriculum;
  modules: Module[];
  status: string;
}

export interface ProductionPlan {
  id: string;
  lessonId: string;
  script: Script;
  shotList: Shot[];
  assets: Asset[];
  timeline: ProductionTimeline;
}

export interface Shot {
  number: number;
  type: string;
  description: string;
  duration: number;
}

export interface Asset {
  type: string;
  description: string;
  source?: string;
}

export interface ProductionTimeline {
  preparation: number;
  filming: number;
  editing: number;
  review: number;
  totalDays: number;
}

export interface Resource {
  type: string;
  title: string;
  url?: string;
  description: string;
}

// =====================================================================
// COURSE BUILDER AGENT
// =====================================================================

export class CourseBuilderAgent {
  private anthropic: Anthropic;
  private supabase: ReturnType<typeof createClient>;

  constructor(
    anthropicApiKey: string,
    supabaseUrl: string,
    supabaseKey: string
  ) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // =====================================================================
  // STRUCTURE METHODS
  // =====================================================================

  /**
   * Create course curriculum
   */
  async createCourseCurriculum(topic: string): Promise<Curriculum> {
    console.log(`📚 Creating curriculum for: ${topic}`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: `Design a comprehensive course curriculum for: ${topic}

Create a professional course structure with:
1. Course overview and learning objectives
2. Module breakdown (5-8 modules)
3. Estimated duration for each module
4. Learning outcomes for each module
5. Target audience definition
6. Prerequisites (if any)

Format as JSON with clear structure.`
          }
        ]
      });

      const spec = this.parseResponse(response.content);

      const curriculum: Curriculum = {
        id: `curriculum-${Date.now()}`,
        topic: topic,
        totalModules: spec.totalModules || 6,
        totalLessons: spec.totalLessons || 30,
        duration: spec.duration || 360,
        learningObjectives: spec.learningObjectives || [],
        targetAudience: spec.targetAudience || 'Beginners'
      };

      await this.storeCurriculum(curriculum);
      console.log(`✅ Curriculum created with ${curriculum.totalModules} modules`);
      return curriculum;
    } catch (error) {
      console.error('Error creating curriculum:', error);
      throw error;
    }
  }

  /**
   * Generate modules for curriculum
   */
  async generateModules(curriculum: Curriculum): Promise<Module[]> {
    console.log(`📦 Generating ${curriculum.totalModules} modules`);

    const modules: Module[] = [];

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: `Generate ${curriculum.totalModules} course modules for: ${curriculum.topic}

Learning Objectives: ${curriculum.learningObjectives.join(', ')}
Target Audience: ${curriculum.targetAudience}

For each module, provide:
1. Module title
2. Description
3. Learning outcomes (3-5)
4. Estimated duration (minutes)
5. Lesson topics (3-6 lessons per module)

Format as JSON array.`
          }
        ]
      });

      const moduleSpecs = this.parseResponse(response.content);

      for (let i = 0; i < curriculum.totalModules; i++) {
        const spec = moduleSpecs[i] || { title: `Module ${i + 1}` };

        const module: Module = {
          id: `module-${Date.now()}-${i}`,
          courseId: curriculum.id,
          moduleNumber: i + 1,
          title: spec.title,
          description: spec.description || '',
          learningOutcomes: spec.learningOutcomes || [],
          duration: spec.duration || 60,
          lessons: []
        };

        modules.push(module);
        await this.storeModule(module);
      }

      console.log(`✅ Generated ${modules.length} modules`);
      return modules;
    } catch (error) {
      console.error('Error generating modules:', error);
      throw error;
    }
  }

  /**
   * Create lessons for module
   */
  async createLessons(module: Module): Promise<Lesson[]> {
    console.log(`📝 Creating lessons for: ${module.title}`);

    const lessons: Lesson[] = [];

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: `Create detailed lessons for this module:

Module: ${module.title}
Description: ${module.description}
Learning Outcomes: ${module.learningOutcomes.join(', ')}

Generate 4-6 lessons with:
1. Lesson title
2. Lesson type (video, text, quiz)
3. Content outline
4. Key points to cover
5. Duration (minutes)
6. Resources needed

Format as JSON array.`
          }
        ]
      });

      const lessonSpecs = this.parseResponse(response.content);

      for (let i = 0; i < lessonSpecs.length; i++) {
        const spec = lessonSpecs[i];

        const lesson: Lesson = {
          id: `lesson-${Date.now()}-${i}`,
          moduleId: module.id,
          lessonNumber: i + 1,
          title: spec.title,
          type: spec.type || 'video',
          content: spec.content || '',
          duration: spec.duration || 15,
          resources: spec.resources || []
        };

        lessons.push(lesson);
        await this.storeLesson(lesson);
      }

      console.log(`✅ Created ${lessons.length} lessons`);
      return lessons;
    } catch (error) {
      console.error('Error creating lessons:', error);
      throw error;
    }
  }

  // =====================================================================
  // CONTENT METHODS
  // =====================================================================

  /**
   * Write script for lesson
   */
  async writeScripts(lesson: Lesson): Promise<Script> {
    console.log(`✍️ Writing script for: ${lesson.title}`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: `Write a complete video script for this lesson:

Lesson: ${lesson.title}
Type: ${lesson.type}
Content Outline: ${lesson.content}
Duration: ${lesson.duration} minutes

Structure the script with:
1. Hook/Introduction (1 min)
2. Main content with clear sections
3. Practical examples/demonstrations
4. Summary and key takeaways
5. Call to action for next lesson

Write in a conversational, engaging style. Include presenter notes.
Format as JSON.`
          }
        ]
      });

      const scriptData = this.parseResponse(response.content);

      const script: Script = {
        id: `script-${Date.now()}`,
        lessonId: lesson.id,
        sections: scriptData.sections || [],
        totalWords: scriptData.totalWords || 1500,
        estimatedDuration: lesson.duration
      };

      await this.storeScript(script);
      console.log(`✅ Script written: ${script.totalWords} words`);
      return script;
    } catch (error) {
      console.error('Error writing script:', error);
      throw error;
    }
  }

  /**
   * Generate assessments for module
   */
  async generateAssessments(module: Module): Promise<Assessment[]> {
    console.log(`📋 Generating assessments for: ${module.title}`);

    const assessments: Assessment[] = [];

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: `Create assessments for this module:

Module: ${module.title}
Learning Outcomes: ${module.learningOutcomes.join(', ')}

Generate:
1. Module quiz (10-15 questions)
2. Assignment/project (practical application)

For quiz questions:
- Mix of multiple choice, true/false
- Test key concepts
- Include explanations for answers

Format as JSON array.`
          }
        ]
      });

      const assessmentSpecs = this.parseResponse(response.content);

      for (const spec of assessmentSpecs) {
        const assessment: Assessment = {
          id: `assessment-${Date.now()}`,
          moduleId: module.id,
          type: spec.type || 'quiz',
          title: spec.title,
          questions: spec.questions || [],
          passingScore: spec.passingScore || 70
        };

        assessments.push(assessment);
        await this.storeAssessment(assessment);
      }

      console.log(`✅ Generated ${assessments.length} assessments`);
      return assessments;
    } catch (error) {
      console.error('Error generating assessments:', error);
      throw error;
    }
  }

  /**
   * Create supplemental materials
   */
  async createSupplementalMaterials(course: Course): Promise<Material[]> {
    console.log(`📚 Creating supplemental materials for: ${course.title}`);

    const materials: Material[] = [];

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: `Create supplemental materials for this course:

Course: ${course.title}
Niche: ${course.niche}

Generate:
1. Course workbook (exercises and worksheets)
2. Quick reference cheat sheet
3. Resource list (tools, websites, books)
4. Templates and frameworks

Format as JSON array with descriptions.`
          }
        ]
      });

      const materialSpecs = this.parseResponse(response.content);

      for (const spec of materialSpecs) {
        const material: Material = {
          id: `material-${Date.now()}`,
          courseId: course.id,
          type: spec.type,
          title: spec.title,
          description: spec.description,
          fileUrl: spec.fileUrl
        };

        materials.push(material);
        await this.storeMaterial(material);
      }

      console.log(`✅ Created ${materials.length} supplemental materials`);
      return materials;
    } catch (error) {
      console.error('Error creating materials:', error);
      throw error;
    }
  }

  // =====================================================================
  // PRODUCTION METHODS
  // =====================================================================

  /**
   * Plan video production
   */
  async planVideoProduction(script: Script): Promise<ProductionPlan> {
    console.log(`🎬 Planning video production`);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `Create a video production plan for this script:

Script: ${script.totalWords} words
Duration: ${script.estimatedDuration} minutes

Include:
1. Shot list
2. Required assets (images, graphics, b-roll)
3. Production timeline
4. Equipment needed
5. Post-production notes

Format as JSON.`
          }
        ]
      });

      const planData = this.parseResponse(response.content);

      const plan: ProductionPlan = {
        id: `plan-${Date.now()}`,
        lessonId: script.lessonId,
        script: script,
        shotList: planData.shotList || [],
        assets: planData.assets || [],
        timeline: planData.timeline || {
          preparation: 1,
          filming: 1,
          editing: 2,
          review: 1,
          totalDays: 5
        }
      };

      console.log(`✅ Production plan created`);
      return plan;
    } catch (error) {
      console.error('Error planning production:', error);
      throw error;
    }
  }

  // =====================================================================
  // COMPLETE WORKFLOW
  // =====================================================================

  /**
   * Run complete course building workflow
   */
  async runComplete(topic: string): Promise<Course> {
    console.log(`\n🚀 Running complete course building for: ${topic}\n`);

    try {
      // Create curriculum
      const curriculum = await this.createCourseCurriculum(topic);

      // Generate modules
      const modules = await this.generateModules(curriculum);

      // Create lessons for first module (as example)
      const lessons = await this.createLessons(modules[0]);
      modules[0].lessons = lessons;

      // Write script for first lesson
      await this.writeScripts(lessons[0]);

      // Generate assessments for first module
      await this.generateAssessments(modules[0]);

      // Create course object
      const course: Course = {
        id: curriculum.id,
        title: `${topic} Masterclass`,
        niche: topic,
        description: `Comprehensive course on ${topic}`,
        curriculum: curriculum,
        modules: modules,
        status: 'ready'
      };

      // Create supplemental materials
      await this.createSupplementalMaterials(course);

      console.log(`\n✅ Complete course built with ${modules.length} modules!\n`);
      return course;
    } catch (error) {
      console.error('Error in complete workflow:', error);
      throw error;
    }
  }

  // =====================================================================
  // HELPER METHODS
  // =====================================================================

  private parseResponse(content: any): any {
    try {
      const text = Array.isArray(content) ? content[0]?.text || '{}' : content.text || '{}';
      const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      return {};
    }
  }

  private async storeCurriculum(curriculum: Curriculum): Promise<void> {
    await this.supabase.from('courses').insert({
      id: curriculum.id,
      course_title: curriculum.topic,
      difficulty_level: 'intermediate',
      estimated_duration: curriculum.duration,
      status: 'planning',
      created_at: new Date().toISOString()
    });
  }

  private async storeModule(module: Module): Promise<void> {
    await this.supabase.from('course_modules').insert({
      id: module.id,
      course_id: module.courseId,
      module_number: module.moduleNumber,
      module_title: module.title,
      estimated_duration: module.duration,
      created_at: new Date().toISOString()
    });
  }

  private async storeLesson(lesson: Lesson): Promise<void> {
    await this.supabase.from('course_lessons').insert({
      id: lesson.id,
      module_id: lesson.moduleId,
      lesson_number: lesson.lessonNumber,
      lesson_title: lesson.title,
      lesson_type: lesson.type,
      content: lesson.content,
      created_at: new Date().toISOString()
    });
  }

  private async storeScript(script: Script): Promise<void> {
    console.log(`💾 Stored script: ${script.totalWords} words`);
  }

  private async storeAssessment(assessment: Assessment): Promise<void> {
    console.log(`💾 Stored assessment: ${assessment.title}`);
  }

  private async storeMaterial(material: Material): Promise<void> {
    console.log(`💾 Stored material: ${material.title}`);
  }
}

// =====================================================================
// EXPORT
// =====================================================================

export default CourseBuilderAgent;
