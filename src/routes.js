import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'


const database = new Database()

export const routes = [
    {
        method: 'GET',
        url: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query
            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        url: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            if (!title || !description) {
                return res.writeHead(400).end(JSON.stringify('The attributes title and description are required'))
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                created_at: Date.now(),
                updated_at: Date.now(),
                completed_at: null
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        url: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            const [task] = database.select('tasks', { id })

            if (!task) {
                return res.writeHead(404).end()
            }

            if (title && description) {
                database.update('tasks', id, {
                    title,
                    description,
                    updated_at: Date.now()
                })
            } else if (title) {
                database.update('tasks', id, {
                    title,
                    updated_at: Date.now()
                })
            } else if (description) {
                database.update('tasks', id, {
                    description,
                    updated_at: Date.now()
                })
            } else {
                return res.writeHead(400).end(JSON.stringify('title or description are required'))
            }

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        url: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { completed_at } = req.body

            const [task] = database.select('tasks', { id })

            if (!task) {
                return res.writeHead(404).end()
            }

            if (completed_at) {
                database.update('tasks', id, {
                    completed_at: Date.now()
                })
            } else {
                database.update('tasks', id, {
                    completed_at: null
                })
            }

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        url: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const [task] = database.select('tasks', { id })

            if (!task) {
                return res.writeHead(404).end()
            }

            database.delete('tasks', id)
            
            return res.writeHead(204).end()
        }
    }
]