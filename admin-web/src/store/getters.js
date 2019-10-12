export const navItem = state => {
  const result = [];
  for(const index in state.projects) {
    const p = state.projects[index];
    const project = { id: index, name: p.name, submenu: []};
    for(const t of p.tables) {
      project.submenu.push({ id: t.id, name: t.name || t.table_name, table: t.table_name });
    }
    if(project.submenu.length > 0) result.push(project);
  }
  return result;
};

export const projects = state => {
  const result = [];
  for(const index in state.projects) {
    const p = state.projects[index];
    const project = { value: p.id, name: p.name };
    result.push(project);
  }
  return result;
};

export const users = state => {
  const result = [];
  for(const index in state.users) {
    const u = state.users[index];
    const user = { key: u.id, label: u.name };
    result.push(user);
  }
  return result;
};

export const schemas = state => {
  const result = {};
  for(const p of state.projects) {
    for(const t of p.tables) {
      result[t.table_name] = t;
    }
  }
  return result;
};
