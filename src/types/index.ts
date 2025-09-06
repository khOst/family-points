export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  dateOfBirth: Date;
  totalPoints: number;
  createdAt: Date;
}

export interface Group {
  id: string;
  name: string;
  photo?: string;
  adminId: string;
  inviteCode: string;
  memberIds: string[];
  createdAt: Date;
}

export interface Task {
  id: string;
  groupId: string;
  title: string;
  description: string;
  points: number;
  deadline: Date;
  assignedTo?: string;
  status: 'pending' | 'completed' | 'confirmed';
  createdBy: string;
  completedBy?: string;
  completedAt?: Date;
  createdAt: Date;
}

export interface WishlistItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  estimatedPrice: number;
  link?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  groupId: string;
  taskId: string;
  points: number;
  timestamp: Date;
}

export interface GroupMembership {
  groupId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
}