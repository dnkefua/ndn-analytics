import React, { useState } from 'react';
import { Course } from '../types';

interface AcademyCatalogProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
}

export default function AcademyCatalog({ courses, onSelectCourse }: AcademyCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [tagFilter, setTagFilter] = useState('ALL');

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel =
      levelFilter === 'ALL' ||
      course.level === levelFilter;

    const matchesTag =
      tagFilter === 'ALL' ||
      (tagFilter === 'FIREBASE' && (course.category === 'FIREBASE_GCP' || course.title.includes('Firebase'))) ||
      (tagFilter === 'GCP' && course.category === 'GCP_ARCHITECTURE') ||
      (tagFilter === 'PLAY_STORE' && course.category === 'PLAY_STORE_DEV') ||
      (tagFilter === 'AI' && (course.category === 'AI_ENGINEERING' || course.category === 'BIGDATA_MLOPS'));

    return matchesSearch && matchesLevel && matchesTag;
  });

  const toggleLevelFilter = () => {
    const levels = ['ALL', 'L1_FOUNDATION', 'L2_INTERMEDIATE', 'L3_PROFESSIONAL', 'L4_EXPERT'];
    const currentIndex = levels.indexOf(levelFilter);
    const nextIndex = (currentIndex + 1) % levels.length;
    setLevelFilter(levels[nextIndex]);
  };

  const toggleTagFilter = () => {
    const tags = ['ALL', 'FIREBASE', 'GCP', 'PLAY_STORE', 'AI'];
    const currentIndex = tags.indexOf(tagFilter);
    const nextIndex = (currentIndex + 1) % tags.length;
    setTagFilter(tags[nextIndex]);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setLevelFilter('ALL');
    setTagFilter('ALL');
  };

  return (
    <section className="mb-12 font-sans">
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-neon-cyan pl-6 mb-8">
        <div>
          <span className="font-mono text-[10px] font-bold text-neon-cyan mb-2 block uppercase tracking-widest">
            [ ACADEMY_CATALOG ]
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white">
            Masterclass Engineering
            <br />
            Curriculum
          </h1>
        </div>
        <div className="flex flex-col gap-2 font-mono">
          <div className="flex items-center gap-3 text-xs text-on-surface-variant">
            <span className="w-2.5 h-2.5 rounded-full bg-success-glimmer status-glimmer"></span>
            [ 5 Master Tracks Available ]
          </div>
          <div className="flex items-center gap-3 text-xs text-on-surface-variant">
            <span className="w-2.5 h-2.5 rounded-full bg-warning-amber"></span>
            [ 300 CPD Credits Total ]
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-4 border border-circuit-line mb-8 font-mono">
        <div className="flex-1 min-w-[200px] relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            search
          </span>
          <input
            className="w-full bg-surface-container-lowest border border-circuit-line focus:border-neon-cyan rounded-none pl-10 pr-4 py-2 text-xs text-neon-cyan placeholder:text-on-surface-variant outline-none transition-all"
            placeholder="QUERY_COURSE_DATABASE..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleLevelFilter}
            className="px-4 py-2 border border-circuit-line text-[10px] font-bold tracking-wider hover:bg-neon-cyan/10 hover:border-neon-cyan text-on-surface transition-all cursor-pointer"
          >
            LEVEL: {levelFilter.replace(/_/g, ' ')}
          </button>
          <button
            onClick={toggleTagFilter}
            className="px-4 py-2 border border-circuit-line text-[10px] font-bold tracking-wider hover:bg-neon-cyan/10 hover:border-neon-cyan text-on-surface transition-all cursor-pointer"
          >
            TAGS: {tagFilter}
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-neon-cyan bg-neon-cyan/10 text-neon-cyan text-[10px] font-bold tracking-wider flex items-center gap-2 hover:bg-neon-cyan hover:text-deep-void transition-all cursor-pointer uppercase"
          >
            <span className="material-symbols-outlined text-sm">tune</span> REFRESH
          </button>
        </div>
      </div>

      {/* Grid of Course Cards */}
      {filteredCourses.length === 0 ? (
        <div className="glass-card p-12 text-center border border-circuit-line">
          <p className="font-mono text-sm text-on-surface-variant mb-2">NO MATCHES FOUND IN DATABASE</p>
          <button onClick={resetFilters} className="text-neon-cyan underline font-mono text-xs cursor-pointer">
            CLEAR ALL FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group glass-card overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:border-neon-cyan border border-circuit-line rounded-xl"
            >
              <div className="h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-deep-void to-transparent z-10"></div>
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={course.image}
                  alt={course.title}
                />
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <span className="px-3 py-1 bg-deep-void/80 border border-neon-cyan text-neon-cyan font-mono text-[9px] tracking-tighter rounded">
                    [ {course.level} ]
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-display text-xl font-bold mb-2 leading-tight group-hover:text-neon-cyan transition-colors duration-300 text-white">
                  {course.title}
                </h3>
                <p className="text-xs text-on-surface-variant mb-6 flex-1 leading-relaxed">
                  {course.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 border-y border-circuit-line py-4 font-mono">
                  <div>
                    <span className="block text-[9px] text-on-surface-variant mb-1 uppercase tracking-wider">
                      Duration
                    </span>
                    <span className="text-xs font-bold text-on-surface">
                      {course.duration}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-on-surface-variant mb-1 uppercase tracking-wider">
                      Credits
                    </span>
                    <span className="text-xs font-bold text-neon-cyan">
                      {course.credits}
                    </span>
                  </div>
                </div>

                <div className="mb-6 font-mono">
                  <span className="block text-[9px] text-on-surface-variant mb-3 uppercase tracking-wider">
                    Syllabus Overview
                  </span>
                  <ul className="space-y-2">
                    {course.syllabus.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-xs mt-0.5 text-neon-cyan select-none">
                          subdirectory_arrow_right
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectCourse(course.id)}
                  className="w-full py-3 border border-neon-cyan bg-neon-cyan text-deep-void font-mono text-xs font-bold tracking-wider hover:bg-transparent hover:text-neon-cyan transition-all flex items-center justify-center gap-2 cursor-pointer uppercase rounded-lg"
                >
                  INITIALIZE_ENROLLMENT <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
