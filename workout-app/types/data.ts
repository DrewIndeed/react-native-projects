export type Difficulty = 'easy' | 'normal' | 'hard';

export interface Workout {
    slug: string;
    name: string;
    duration: number;
    // declare custom type to be more specific
    difficulty: Difficulty;

    // declare custom interface because it is an array of custom objects
    // how to read: array of Sequence Item
    sequence: SequenceItem[];
}

export type SequenceType = 'exercise' | 'stretch' | 'break';
export interface SequenceItem {
    slug: string;
    name: string;

    // declare custom type to be more specific
    type: SequenceType;
    duration: number;

    // '?': because some exercise don't have reps
    reps?: number;
}
