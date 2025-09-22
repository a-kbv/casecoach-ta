export type Usage = 'frontend' | 'backend' | 'full stack';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Popularity = 'low' | 'medium' | 'high';

export interface Technology {
    id: string;
    name: string;
    usage: Usage;
    difficulty: Difficulty;
    popularity: Popularity;
    firstRelease: number;
    typescript: boolean;
    description: string;
}

export interface CreateTechnologyRequest extends Omit<Technology, 'id'> {}
export type UpdateTechnologyRequest = Partial<CreateTechnologyRequest>;


