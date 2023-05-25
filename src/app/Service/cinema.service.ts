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
  baseUrl = 'http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/';

  constructor(private http: HttpClient) {
  }

  getCities() {
    return this.http.get( 'http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/villes');
  }

  getCinemas(url: string) {
    let end_part=url.split("http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/")[1]
    console.error("END PART",end_part)
    return this.http.get("http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/"+end_part);
  }

  getSalles(selectedCinema: any) {
    let url=selectedCinema._links.salles.href
    console.log("URL",url)
    let end_part=url.split("http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/")[1]
    console.error("END PART",end_part)
    return this.http.get("http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/"+end_part);
  }

  getProjection(salle: any) {
    const url = salle._links.projections.href.replace('{?projection}', '') + '?projection=FilmProjection';
    let end_part=url.split("http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/")[1]
    console.error("END PART",end_part)

    return this.http.get("http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/"+end_part);
  }

  orderTickets(p: { tickets: number[]; codePayment: string; nomClient: string }) {
    return this.http.post('http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/buyTickets', p);
  }


  fetchTickets(tickets: any) {
    let end_part=tickets.split("http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/")[1]
    console.error("END PART",end_part)
    return this.http.get("http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/"+end_part);
  }

  addFilm(fileList: UploadFile[], data: any) {
    const formData = new FormData();
    fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    formData.append('filmData', new Blob([JSON.stringify(data)], {
      type: 'application/json'
    }));
    return this.http.post<Movie>('http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/addFilm', formData);
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
    const requestUrl = `http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/films?page=${pageIndex - 1}&size=${pageSize}`;
    return this.http.get(requestUrl);

  }

  getMovie(id: number) {
    return this.http.get('http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/films/' + id);
  }

  getMovies() {
    return this.http.get<FilmsResponse>('http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/films/');
  }

  getCity(id: number) {
    return this.http.get<City>('http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/villes/' + id);
  }

  deleteMovie(id: number) {
    return this.http.delete('http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/films/' + id);
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
    return this.http.post<Movie>('http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/modifyMovie', formData);
  }

  addCity(formData: any) {
    return this.http.post<City>('http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/villes', formData);
  }

  deleteCity(id: any) {
    return this.http.delete( 'http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/villes/' + id);
  }

  modifyCity(id: number, rawValue: any) {
    return this.http.patch<City>( 'http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/villes/' + id, rawValue);
  }

  addCinema(rawValue: any) {
    return this.http.post<boolean>( 'http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/addCinema', rawValue);
  }

  deleteCinema(id: any) {
    return this.http.delete( 'http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/cinemas/' + id);
  }

  getCinema(id: number) {
    return this.http.get<Cinema>( 'http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/cinemas/' + id);
  }

  addProjections(data: { movieId: number; projections: { date: any; price: any }[] }) {
    return this.http.post<boolean>( 'http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/updateProjections', data);
  }

  deleteRoom(room: any) {
    console.log("Room Id",room);
    if (room?.id) {
      console.log("Room Id",room);
      return this.http.delete( 'http://ecinemapi.arhghrgqb5exgmd3.eastus.azurecontainer.io:8080/salles/' + room.id);
    }
  }
}
