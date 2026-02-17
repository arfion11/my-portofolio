import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

// Sortable Item Component
function SortableItem({ project }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      layoutId={project.id}
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 flex items-center justify-between group hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-xl ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
      animate={{ scale: isDragging ? 1.05 : 1 }}
    >
      <div className="flex items-center gap-4 flex-1">
        <div {...listeners} className="cursor-grab hover:text-blue-600 touch-none">
          <GripVertical className="text-gray-400" />
        </div>
        <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
          {project.images && project.images.length > 0 ? (
            <img
              src={project.images[0]}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{project.title}</h3>
          <p className="text-sm text-gray-500">{project.company}</p>
        </div>
      </div>
      <div className="text-sm text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
        Order: {project.displayOrder !== undefined ? project.displayOrder : '-'}
      </div>
    </motion.div>
  );
}

export default function FeaturedProjectsManager({ projects, onReorder, isOpen, onToggle }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    onReorder(event);
  };

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100">
            <GripVertical className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Manage Featured Projects Order</h2>
            <p className="text-sm text-gray-500">Drag and drop to reorder featured projects</p>
          </div>
        </div>
        <motion.button
          onClick={onToggle}
          className="text-gray-600 hover:text-gray-800 font-medium text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? 'Hide' : 'Show'}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 rounded-lg p-6"
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={projects.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                {projects.map((project) => (
                  <SortableItem key={project.id} project={project} />
                ))}
              </SortableContext>
            </DndContext>

            {projects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>
                  No featured projects yet. Mark projects as &quot;Selected Project (Featured)&quot;
                  to manage their order here.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
