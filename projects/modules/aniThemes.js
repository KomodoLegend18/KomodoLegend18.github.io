import { clientRequest } from "./xhr.js";

const url = `https://api.animethemes.moe/anime?filter[has]=resources&include=animethemes.animethemeentries,animethemes.song.artists,animethemes.animethemeentries.videos.audio,animethemes.group,images,series,studios`
export const AnimeThemesClient = {
    MALid: async function (id){
        try {
            const MALurl = `&filter[site]=MyAnimeList&filter[external_id]=${id}`
            const u = encodeURIComponent(url+MALurl)
            const resp = await clientRequest({
                method:"GET",
                url:u,
                cors:true,
                respType:"json"
            })
            return resp
        } catch (error) {
            if (JSON.parse(error)) {
                let err = JSON.parse(error)
                if (err.data.status>=400) {
                    throw `[aniThemeClient] ${err.data.status} | ${err.data.result.error}\n${err.data.result.message}`
                } else {
                    throw new Error(error)
                }
            }
        }
    }
}