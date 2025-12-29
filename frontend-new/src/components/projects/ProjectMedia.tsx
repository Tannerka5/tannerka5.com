import { motion } from "framer-motion";
import type { FC } from "react";

interface MediaItem {
  type: 'video' | 'image' | 'embed';
  url: string;
  caption: string;
  thumbnail?: string;
}

interface ProjectMediaProps {
  media: MediaItem[];
}

const ProjectMedia: FC<ProjectMediaProps> = ({ media }) => {
  if (!media || media.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-display font-bold text-earth mb-12 text-center"
        >
          Media & Screenshots
        </motion.h2>

        <div className="space-y-12">
          {media.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-cream p-6 rounded-xl"
            >
              {item.type === 'video' && (
                <video
                  controls
                  poster={item.thumbnail}
                  className="w-full rounded-lg shadow-lg mb-4"
                >
                  <source src={item.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {item.type === 'image' && (
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full rounded-lg shadow-lg mb-4"
                />
              )}
              {item.type === 'embed' && (
                <div className="aspect-video rounded-lg overflow-hidden shadow-lg mb-4">
                  <iframe
                    src={item.url}
                    className="w-full h-full"
                    allowFullScreen
                    title={item.caption}
                  />
                </div>
              )}
              <p className="text-earth/70 text-center italic">{item.caption}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectMedia;
