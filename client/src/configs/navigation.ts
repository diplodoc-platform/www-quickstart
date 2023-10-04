import type { NavigationData } from '@gravity-ui/page-constructor';
import { config } from './contig';

const state = config<NavigationData>('navigation');

export const header = state.header;

export const logo = state.logo;