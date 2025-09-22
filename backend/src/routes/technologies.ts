import { Request, Response, Router } from "express";
import { TechnologyModel } from "../models/technology";
import { CreateTechnologyRequest, TechnologyParams, UpdateTechnologyRequest } from "../types/technology";


const router = Router();

router.get('/', (req, res) => {
    const technologies = TechnologyModel.getAll();
    res.json(technologies);
})

router.get('/:id', (req: Request<TechnologyParams>, res: Response) => {
    const id = req.params.id;
    const technology = TechnologyModel.getById(id)

    if (!technology) {
        return res.status(404).json({
            error: 'Technology not found'
        });
    }

    res.json(technology)
})

router.post('/', (req: Request<{}, {}, CreateTechnologyRequest>, res: Response) => {
    try {
        const data: CreateTechnologyRequest = req.body;
        const newTechnology = TechnologyModel.create(data);
        res.status(201).json(newTechnology);
    } catch (err) {
        res.status(400).json({
            error: 'Invalid data provided'
        });
    }
})

router.put("/:id", (req: Request<TechnologyParams, {}, CreateTechnologyRequest>, res: Response) => {
    const { id } = req.params;

    const updated = TechnologyModel.update(id, req.body);
    if (!updated) {
        return res.status(404).json({
            message: "Technology not found"
        });
    }

    res.json(updated);
});

router.patch("/:id", (req: Request<TechnologyParams, {}, UpdateTechnologyRequest>, res: Response) => {
    const { id } = req.params;

    const updated = TechnologyModel.update(id, req.body);
    if (!updated) {
        return res.status(404).json({
            message: "Technology not found"
        });
    }

    res.json(updated);
});

router.delete("/:id", (req: Request<TechnologyParams>, res: Response) => {
    const { id } = req.params;

    const deleted = TechnologyModel.delete(id);
    if (!deleted) {
        return res.status(404).json({
            message:
                "Technology not found"
        });
    }
    return res.status(204).send();
});

export default router;