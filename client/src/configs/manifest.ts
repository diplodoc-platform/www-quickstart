import {config} from './contig';

type Manifest = {
    styles: string[];
    scripts: string[];
    prefetch: string[];
};

const state = config<Manifest>('manifest');

export const styles = state.styles;

export const scripts = state.scripts;