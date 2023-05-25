import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UploadFile} from 'ng-zorro-antd';
import Movie from '../Data/Movie';
import {FormControl} from '@angular/forms';
import {City} from '../Data/City';
import {Cinema} from '../Data/CinemasResponse';
import {FilmsResponse} from '../Data/FilmsResponse';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  baseUrl = '/spring-api/';

  constructor(private http: HttpClient) {
  }

  getCities() {
    return this.http.get( '/spring-api/villes');
  }

  getCinemas(url: string) {
    console.log("URL",url)
    let end_part=url.split("http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/")[1]
    console.error("END PART",end_part)
    return this.http.get("/spring-api/"+end_part);
  }

  getSalles(selectedCinema: any) {
    let url=selectedCinema._links.salles.href
    console.log("URL",url)
    let end_part=url.split("http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/")[1]
    console.error("END PART",end_part)
    return this.http.get("/spring-api/"+end_part);
  }

  getProjection(salle: any) {
    const url = salle._links.projections.href.replace('{?projection}', '') + '?projection=FilmProjection';
    let end_part=url.split("http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/")[1]
    console.error("END PART",end_part)

    return this.http.get("/spring-api/"+end_part);
  }

  orderTickets(p: { tickets: number[]; codePayment: string; nomClient: string }) {
    return this.http.post('/spring-api/buyTickets', p);
  }


  fetchTickets(tickets: any) {
    let end_part=tickets.split("http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/")[1]
    console.error("END PART",end_part)
    return this.http.get("/spring-api/"+end_part);
  }

  addFilm(fileList: UploadFile[], data: any) {
    const formData = new FormData();
    fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    formData.append('filmData', new Blob([JSON.stringify(data)], {
      type: 'application/json'
    }));
    return this.http.post<Movie>('/spring-api/addFilm', formData);
  }

  onlyNumbers = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (isNaN(control.value)) {
      return {chars: true, error: true};
    }
    return {};
  }

  getFilms(pageSize: number, pageIndex: number) {
    const requestUrl = `/spring-api/films?page=${pageIndex - 1}&size=${pageSize}`;
    return this.http.get(requestUrl);

  }

  getMovie(id: number) {
    return this.http.get('/spring-api/films/' + id);
  }

  getMovies() {
    return this.http.get<FilmsResponse>('/spring-api/films/');
  }

  getCity(id: number) {
    return this.http.get<City>('/spring-api/villes/' + id);
  }

  deleteMovie(id: number) {
    return this.http.delete('/spring-api/films/' + id);
  }

  modifyFilm(fileList: UploadFile[], movie: Movie, rawValue: Movie) {
    const formData = new FormData();

    formData.append('file', null);
    fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    rawValue.id = movie.id;
    rawValue.photo = movie.photo;
    formData.append('filmData', new Blob([JSON.stringify(rawValue)], {
      type: 'application/json'
    }));
    return this.http.post<Movie>('/spring-api/modifyMovie', formData);
  }

  addCity(formData: any) {
    return this.http.post<City>('/spring-api/villes', formData);
  }

  deleteCity(id: any) {
    return this.http.delete( '/spring-api/villes/' + id);
  }

  modifyCity(id: number, rawValue: any) {
    return this.http.patch<City>( '/spring-api/villes/' + id, rawValue);
  }

  addCinema(rawValue: any) {
    return this.http.post<boolean>( '/spring-api/addCinema', rawValue);
  }

  deleteCinema(id: any) {
    return this.http.delete( '/spring-api/cinemas/' + id);
  }

  getCinema(id: number) {
    return this.http.get<Cinema>( '/spring-api/cinemas/' + id);
  }

  addProjections(data: { movieId: number; projections: { date: any; price: any }[] }) {
    return this.http.post<boolean>( '/spring-api/updateProjections', data);
  }

  deleteRoom(room: any) {
    console.log("Room Id",room);
    if (room?.id) {
      console.log("Room Id",room);
      return this.http.delete( '/spring-api/salles/' + room.id);
    }
  }
}
