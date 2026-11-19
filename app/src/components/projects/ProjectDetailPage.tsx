import { useMemo } from 'react';
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
import type { Project as CanonicalProject, Challenge, MediaItem } from '../../types/project';
import { normalizeChallenges, normalizeMedia, type RenderableMedia } from '../../lib/project-utils';

// API data may be partial or (for challenges/media) in a legacy string-array
// shape from before those fields were structured objects — this type stays
// tolerant of that on read, while the canonical Project type used for
// editing assumes fully-structured data.
type RenderableProject = Partial<Omit<CanonicalProject, 'detailed'>> & {
    slug: string;
    title: string;
    detailed?: Partial<Omit<CanonicalProject['detailed'], 'challenges' | 'media'>> & {
        challenges?: Challenge[] | string[];
        media?: RenderableMedia[];
    };
};

interface ProjectDetailPageProps {
    initialProject: RenderableProject;
    allSlugs: string[];
}

const ProjectDetailPage: FC<ProjectDetailPageProps> = ({ initialProject, allSlugs }) => {
    const project = initialProject;

    const normalizedChallenges: Challenge[] = useMemo(
        () => normalizeChallenges(project.detailed?.challenges),
        [project.detailed?.challenges]
    );

    const normalizedMedia: MediaItem[] = useMemo(
        () => normalizeMedia(project.detailed?.media),
        [project.detailed?.media]
    );

    return (
        <>
            <ProjectDetailHero
                project={{
                    title: project.title,
                    role: project.role || '',
                    timeline: project.timeline || '',
                    gradientFrom: project.gradientFrom || 'from-pink-100 dark:from-pink-900/40',
                    gradientVia: project.gradientVia || 'via-pink-200 dark:via-purple-900/40',
                    gradientTo: project.gradientTo || 'to-purple-100 dark:to-purple-900/40',
                    logo: project.logo,
                    icon: project.icon,
                    links: project.links || { live: '', github: '', demo: '' },
                }}
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
