import { useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import ProjectDetailHero from './ProjectDetailHero';
import ProjectTechStack from './ProjectTechStack';
import ProjectOverview from './ProjectOverview';
import ProjectChallenges from './ProjectChallenges';
import ProjectLearnings from './ProjectLearnings';
import ProjectMetrics from './ProjectMetrics';
import ProjectMedia from './ProjectMedia';
import ProjectNavigation from './ProjectNavigation';
import AnimatedDivider from '../AnimatedDivider';

interface Challenge {
  title: string;
  description: string;
  solution: string;
}

interface MediaItem {
  type: 'video' | 'image' | 'embed';
  url: string;
  caption: string;
  thumbnail?: string;
}

interface Project {
  slug: string;
  title: string;
  role?: string;
  timeline?: string;
  shortDescription?: string;
  fullDescription?: string;
  techStack?: string[];
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  logo?: string;
  icon?: string;
  links?: {
    live?: string;
    github?: string;
    demo?: string;
  };
  detailed?: {
    overview?: string;
    problem?: string;
    solution?: string;
    challenges?: Challenge[] | string[];
    learnings?: string[];
    features?: string[];
    metrics?: Array<{ label: string; value: string }>;
    media?: MediaItem[] | Array<{ type: string; url: string; thumbnail?: string }>;
  };
}

interface ProjectDetailPageProps {
  initialProject: Project;
  allSlugs: string[];
  apiBaseUrl: string;
}

const ProjectDetailPage: FC<ProjectDetailPageProps> = ({
  initialProject,
  allSlugs,
  apiBaseUrl,
}) => {
  const [project, setProject] = useState<Project>(initialProject);

  useEffect(() => {
    // Fetch fresh project data on mount
    const fetchFreshData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/projects/${initialProject.slug}`);
        if (response.ok) {
          const data = await response.json();
          if (data.project) {
            setProject(data.project);
            // Update document title
            document.title = `${data.project.title} | Projects`;
          }
        }
      } catch (error) {
        console.debug('Failed to fetch fresh project data:', error);
        // Keep using initial project data on error
      }
    };

    fetchFreshData();
  }, [initialProject.slug, apiBaseUrl]);

  // Transform challenges: handle both string[] and Challenge[] formats
  const normalizedChallenges: Challenge[] = useMemo(() => {
    const challenges = project.detailed?.challenges || [];
    if (challenges.length === 0) return [];
    
    // If first item is a string, it's the old format (string[])
    if (typeof challenges[0] === 'string') {
      return [];
    }
    
    // Otherwise it's already Challenge[]
    return challenges as Challenge[];
  }, [project.detailed?.challenges]);

  // Transform media: ensure caption is present
  const normalizedMedia: MediaItem[] = useMemo(() => {
    const media = project.detailed?.media || [];
    if (media.length === 0) return [];
    
    return media.map((item) => {
      // If it already has caption and correct type, use as-is
      if ('caption' in item && typeof item.caption === 'string') {
        return {
          type: (item.type as 'video' | 'image' | 'embed') || 'image',
          url: item.url || '',
          caption: item.caption,
          thumbnail: item.thumbnail,
        };
      }
      
      // Otherwise, provide default caption
      return {
        type: (item.type as 'video' | 'image' | 'embed') || 'image',
        url: item.url || '',
        caption: item.url || 'Media',
        thumbnail: item.thumbnail,
      };
    });
  }, [project.detailed?.media]);

  return (
    <>
      <ProjectDetailHero
        title={project.title}
        role={project.role || ''}
        timeline={project.timeline || ''}
        gradientFrom={project.gradientFrom || 'from-pink-100 dark:from-pink-900/40'}
        gradientVia={project.gradientVia || 'via-pink-200 dark:via-purple-900/40'}
        gradientTo={project.gradientTo || 'to-purple-100 dark:to-purple-900/40'}
        logo={project.logo}
        icon={project.icon}
        links={project.links || { live: '', github: '', demo: '' }}
      />

      <AnimatedDivider color="#6B9080" />

      <ProjectTechStack techStack={project.techStack || []} />

      <AnimatedDivider color="#2E5266" />

      <ProjectOverview
        fullDescription={project.fullDescription || ''}
        overview={project.detailed?.overview || ''}
        problem={project.detailed?.problem || ''}
        solution={project.detailed?.solution || ''}
      />

      <AnimatedDivider color="#6B9080" />

      <ProjectChallenges challenges={normalizedChallenges} />

      <AnimatedDivider color="#2E5266" />

      <ProjectLearnings
        learnings={project.detailed?.learnings || []}
        features={project.detailed?.features || []}
      />

      <AnimatedDivider color="#6B9080" />

      <ProjectMetrics metrics={project.detailed?.metrics || []} />

      <AnimatedDivider color="#2E5266" />

      <ProjectMedia media={normalizedMedia} />

      <AnimatedDivider color="#6B9080" />

      <ProjectNavigation currentSlug={project.slug} allSlugs={allSlugs} />
    </>
  );
};

export default ProjectDetailPage;
