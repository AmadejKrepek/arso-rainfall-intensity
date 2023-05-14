import axios from 'axios';
import { ILatestRadarSnapshotsTimelineHttpResult } from './types';
import logger from './logger/logger';

class RadarDataSnapshot {
    height: number;
    width: number;
    dateTime: Date;
    dateCompact: string;
    timeCompact: string;
    radarImageUrlPath: string;
    mode: string;

    constructor(arsoResultItem: ILatestRadarSnapshotsTimelineHttpResult) {
        this.height = Number(arsoResultItem.height);
        this.width = Number(arsoResultItem.width);
        this.dateTime = new Date(arsoResultItem.valid);
        this.dateCompact = arsoResultItem.date;
        this.timeCompact = arsoResultItem.hhmm;
        this.radarImageUrlPath = `http://meteo.arso.gov.si${arsoResultItem.path}`;
        this.mode = arsoResultItem.mode;
    }

    async fetchRadarImageBuffer(): Promise<Buffer> {
        const imgBuffer = await axios.get<ArrayBuffer>(this.radarImageUrlPath, {
            responseType: "arraybuffer"
        });
        return Buffer.from(imgBuffer.data);
    }
}

export async function fetchLatestRadarSnapshotsTimeline(): Promise<RadarDataSnapshot[]> {
    try {
        const apiUrl = 'http://meteo.arso.gov.si/uploads/probase/www/nowcast/inca/inca_pp_data.json?prod=pp';
        const response = await axios.get<ILatestRadarSnapshotsTimelineHttpResult[]>(apiUrl, {
            responseType: 'json'
        });
        return response.data.map(item => new RadarDataSnapshot(item));
    }
    catch (err) {
        logger.error(err);
        return [];
    }
}

export async function fetchLatestRadarHailProbabilitySnapshotsTimeline(): Promise<RadarDataSnapshot[]> {
    const apiUrl = 'http://meteo.arso.gov.si/uploads/probase/www/nowcast/inca/inca_hp_data.json?prod=hp';
    const response = await axios.get<ILatestRadarSnapshotsTimelineHttpResult[]>(apiUrl, {
        responseType: 'json'
    });
    return response.data.map(item => new RadarDataSnapshot(item));
}

