import type { APIRoute } from 'astro';
import {production} from '../lib/data';
import { robotsResponse } from '../../shared/robots';

export const GET: APIRoute = () => robotsResponse(production);
