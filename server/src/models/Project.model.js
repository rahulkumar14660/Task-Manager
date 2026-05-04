const mongoose = require('mongoose');

/**
 * Project Schema
 * Represents a project containing team members and associated tasks
 */
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project creator is required'],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

/**
 * Pre-save middleware to ensure the creator is always included in members
 */
projectSchema.pre('save', function (next) {
  if (this.isNew && this.createdBy) {
    const creatorId = this.createdBy.toString();
    const memberIds = this.members.map((m) => m.toString());

    if (!memberIds.includes(creatorId)) {
      this.members.push(this.createdBy);
    }
  }
  next();
});

/**
 * Virtual field to get the count of tasks associated with this project
 */
projectSchema.virtual('taskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  count: true,
});

// Ensure virtuals are included in JSON output
projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
