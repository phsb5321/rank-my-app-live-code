import { HttpService } from '@nestjs/axios';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Proxy')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService
  ) { }

  @Get('/characters')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'characterName', required: false, type: String })
  async getHello(
    @Query('page') page?: number,
    @Query('limit') limit: number = 2,
    @Query('characterName') characterName?: string
  ) {
    const baseURL = `https://rickandmortyapi.com/api/character`;
    const { data } = await this.httpService.axiosRef.get(baseURL)

    data.results = data.results.filter(char => { return char.name.toLowerCase().includes(characterName.toLowerCase()) })

    data.info.count = data.results.length
    data.info.pages = data.results.length / limit;
    data.results = data.results.splice(page * limit, limit);

    return data
  }

  @Get('/characters-by-id/:id')
  @ApiParam({ name: 'id', required: false, type: String })
  async getCharacterById(
    @Param('id') id: String = ''
  ) {
    let baseURL = `https://rickandmortyapi.com/api/character${id ? '/' + id : ''}`;
    if (!id) baseURL.replace('{id}', '');
    const { data } = await this.httpService.axiosRef.get(baseURL)

    return data
  }

  @Get('/characters/:id/episodes')
  @ApiParam({ name: 'id', required: true, type: Number })
  async getCharacterEpisodes(
    @Param('id') id: Number
  ) {
    const baseCharacterURL = `https://rickandmortyapi.com/api/character${id ? '/' + id : ''}`;
    const { data } = await this.httpService.axiosRef.get(baseCharacterURL)
    const episode = data.episode.map(ep => { return ep.split('/').pop() })
    console.log(episode)

    const baseEpisodesURL = `https://rickandmortyapi.com/api/episode/${episode.join(',')}`;
    console.log(baseEpisodesURL)
    const { data: episodes } = await this.httpService.axiosRef.get(baseEpisodesURL)
    const response = episodes.map(({ name, air_date, episode }) => ({ name, air_date, episode })
    )

    return response
  }

}
