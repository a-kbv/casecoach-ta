import path from "path";
import * as fs from 'fs';
import { Technology, CreateTechnologyRequest, UpdateTechnologyRequest } from "../types/technology";

//in-memory storage

let technologies: Technology[] = [];

export class TechnologyModel {

    static getAll(): Technology[] {
        return technologies;
    }

    static getById(id: string): Technology | undefined {
        return technologies.find(technology => technology.id === id);
    }

    static create(data: CreateTechnologyRequest): Technology {
        const newTechnology: Technology = {
            id: Date.now().toString(),
            ...data
        };

        technologies.push(newTechnology);
        return newTechnology;
    }

    static update(id: string, data: Partial<CreateTechnologyRequest>): Technology | null {
        const index = technologies.findIndex(technology => technology.id === id);
        if (index === -1) {
            return null;
        }

        technologies[index] = { ...technologies[index], ...data }
        return technologies[index];
    }

    static delete(id: string): boolean {
        const index = technologies.findIndex(technology => technology.id === id);
        if (index === -1) {
            return false
        }

        technologies.splice(index, 1);
        return true;
    }

    static loadData(): void {
        try {
            const dataPath = path.join(__dirname, '../../data.json');
            const data = fs.readFileSync(dataPath, 'utf8');
            const rawData = JSON.parse(data);

            technologies = rawData.map((item: any, index: number) => ({
                id: (index + 1).toString(),
                ...item
            }));
            console.log(`Data loaded successfully: ${technologies.length} technologies`);
        } catch (error) {
            technologies = [];
        }
    }


}
