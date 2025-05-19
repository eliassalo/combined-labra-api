import { e, gelClient } from "@/gel";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { set, z } from "zod";

const app = new Hono();
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
    exposeHeaders: ["Content-Length", "Content-Type"],
    credentials: true,
    maxAge: 86400,
  })
);

// ----------------------------------------
// Get /projects
// ----------------------------------------
app.get("/projects", async (c) => {
  const query = e.select(e.Project, () => ({
    id: true,
    name: true,
    createdAt: true,
    updatedAt: true,
  }));

  const result = await query.run(gelClient);

  return c.json(result);
});

// ----------------------------------------
// Post /projects
// ----------------------------------------
const projectCreateSchema = z.object({
  name: z.string().min(1),
});

app.post("/projects", async (c) => {
  try {
    const body = await c.req.json();
    const validate = projectCreateSchema.safeParse({
      name: body.name,
    });

    if (!validate.success) {
      return c.json({ error: "Invalid request" }, 400);
    }

    const query = e.insert(e.Project, {
      name: validate.data.name,
    });

    const result = await query.run(gelClient);
    return c.json(result);
  } catch (error) {
    console.error("Error creating project:", error);
    return c.json({ error: "Failed to create project" }, 500);
  }
});

// ----------------------------------------
// Read /projects/:id
// ----------------------------------------
const projectSchema = z.object({
  id: z.string(),
});

app.get("/projects/:id", async (c) => {
  try {
    const validate = projectSchema.safeParse(c.req.param());

    if (!validate.success) {
      return c.json({ error: "Invalid request" }, 400);
    }

    const query = e.select(e.Project, () => ({
      filter_single: { id: validate.data.id },
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      tasks: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        completed: true,
      },
    }));

    const project = await query.run(gelClient);

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    return c.json(project);
  } catch (error) {
    console.error("Error reading project:", error);
    return c.json({ error: "Failed to read project" }, 500);
  }
});

// ----------------------------------------
// Update /projects/:id
// ----------------------------------------
const projectUpdateSchema = z.object({
  id: z.string(),
  name: z.string(),
});

app.patch("/projects/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const validate = projectUpdateSchema.safeParse({
    id,
    name: body.name,
  });

  console.log(validate);

  if (!validate.success) {
    return c.json({ error: "Invalid request" }, 400);
  }

  //  added try-catch block to handle errors gracefully
  // and log them for debugging purposes.
  try {
    const query = e.update(e.Project, () => ({
      filter_single: { id },
      set: {
        name: validate.data.name,
      },
    }));

    const result = await query.run(gelClient);

    // wanted to log the result here whilst debugging
    console.log({ result });

    return c.json(result);

    //  ----------------------------------------
  } catch (error) {
    console.error("Error updating project:", error);
    return c.json({ error: "Failed to update project" }, 500);
  }
});

// ----------------------------------------
// Delete /projects/:id
// ----------------------------------------
app.delete("/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    console.log("Attempting to delete project with id:", id);

    const query = e.delete(e.Project, (p) => ({
      filter_single: e.op(p.id, "=", e.cast(e.uuid, id)),
    }));

    console.log("Delete query constructed, executing...");
    const result = await query.run(gelClient);
    console.log("Delete query result:", result);

    if (!result) {
      console.log("Project not found with id:", id);
      return c.json({ error: "Project not found" }, 404);
    }

    console.log("Project successfully deleted");
    return c.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return c.json({ error: "Failed to delete project" }, 500);
  }
});

// ----------------------------------------
// Create Task /projects/:projectId/tasks
// ----------------------------------------
const addTaskSchema = z.object({
  name: z.string(),
  projectId: z.string(),
});

app.post("/projects/:projectId/tasks", async (c) => {
  console.log(c.req.param());

  try {
    const projectId = c.req.param("projectId");
    const body = await c.req.json();

    const validate = addTaskSchema.safeParse({
      projectId,
      name: body.name,
    });

    if (!validate.success) {
      return c.json({ error: "Invalid request" }, 400);
    }

    console.log(validate);

    const project = e.select(e.Project, () => ({
      filter_single: { id: validate.data.projectId },
    }));

    const query = e.insert(e.Task, {
      name: validate.data.name,
      project,
    });

    await query.run(gelClient);

    return c.json({ message: "Task added successfully" });
  } catch (error) {
    console.error("Error adding task:", error);
    return c.json({ error: "Failed to add task" }, 500);
  }
});

// ----------------------------------------
// Update /tasks/:id
// ----------------------------------------
const updateTaskSchema = z.object({
  id: z.string(),
  completed: z.boolean(),
});

app.put("/tasks/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    const validate = updateTaskSchema.safeParse({
      id,
      completed: body.completed,
    });

    if (!validate.success) {
      return c.json({ error: "Invalid request" }, 400);
    }

    const query = e.update(e.Task, () => ({
      filter_single: { id },
      set: {
        completed: validate.data.completed,
      },
    }));

    const result = await query.run(gelClient);

    if (!result) {
      return c.json({ error: "Task not found" }, 404);
    }

    return c.json(result);
  } catch (error) {
    console.error("Error updating task:", error);
    return c.json({ error: "Failed to update task" }, 500);
  }
});

// ----------------------------------------
// Delete /tasks/:id
// ----------------------------------------
app.delete("/tasks/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const query = e.delete(e.Task, (t) => ({
      filter_single: e.op(t.id, "=", e.cast(e.uuid, id)),
    }));

    const result = await query.run(gelClient);

    if (!result) {
      return c.json({ error: "Task not found" }, 404);
    }

    return c.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return c.json({ error: "Failed to delete task" }, 500);
  }
});

export default app;
