import { createContext } from 'react';
import Triangle from './Triangle';

export const triangleContext = createContext<Triangle | null>(null);