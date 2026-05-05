const mongoose = require('mongoose');

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
  }
);

// Ensure creator is in members
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

// Virtual task count
projectSchema.virtual('taskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  count: true,
});

projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

module.exports =
  mongoose.models.Project ||
  mongoose.model('Project', projectSchema);