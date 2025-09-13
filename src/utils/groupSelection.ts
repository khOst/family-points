const LAST_SELECTED_GROUP_KEY = 'lastSelectedGroupId';

export const getLastSelectedGroupId = (): string | null => {
  try {
    return localStorage.getItem(LAST_SELECTED_GROUP_KEY);
  } catch {
    return null;
  }
};

export const setLastSelectedGroupId = (groupId: string): void => {
  try {
    localStorage.setItem(LAST_SELECTED_GROUP_KEY, groupId);
  } catch {
    // Ignore localStorage errors
  }
};

export const getDefaultGroupId = (groups: Array<{ id: string }>, lastSelectedId?: string): string => {
  // If only one group, auto-select it
  if (groups.length === 1) {
    return groups[0].id;
  }
  
  // If we have a last selected group and it still exists, use it
  if (lastSelectedId && groups.some(g => g.id === lastSelectedId)) {
    return lastSelectedId;
  }
  
  // Otherwise, no default selection
  return '';
};