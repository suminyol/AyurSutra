import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types';
import { notificationService } from '../../services/notificationService';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.getNotifications();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark all notifications as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await notificationService.deleteNotification(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete notification');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
      })
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n.id === action.payload);
        if (index !== -1) {
          const notification = state.notifications[index];
          if (!notification.isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications.splice(index, 1);
        }
      });
  },
});

export const { addNotification, clearError } = notificationSlice.actions;
export default notificationSlice.reducer;
