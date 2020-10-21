import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment.prod';

import { GenresListInterface } from '../interfaces/genres-list.interface';
import { GenresInterface } from '../interfaces/genres.interface';
import { FilmListInterface } from '../interfaces/film-list.interface';
import {FilmInterface} from '../interfaces/film.interface';


@Injectable({
  providedIn: 'root'
})
export class FilmService {

  private apiKey = environment.movieDbApiKey;

  private popularFilmUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=uk-UA&page=1`;
  private nextPagePopularFilmUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=uk-UA&page=`;
  private genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}&language=uk-UA`;

  private count = 1;

  private filmList$: BehaviorSubject<FilmListInterface[]> = new BehaviorSubject(null);
  private filmListArray: FilmListInterface[] = [];

  private genresList$: BehaviorSubject<any[]> = new BehaviorSubject(null);

  private favoriteFilmsCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private favoriteFilmsArray = [];

  private favoriteFilmsArray$: BehaviorSubject<FilmListInterface[]> = new BehaviorSubject<FilmListInterface[]>([]);
  private favoriteFilmsList = [];

  private currentFilm$: Subject<FilmListInterface> = new Subject<FilmListInterface>();

  constructor(private http: HttpClient) { }

  public initFilmList(): Observable<any> {

    return this.http.get(this.popularFilmUrl).pipe(
      tap((filmList: FilmInterface) => {
        console.log(filmList);
        this.updateFilmList(filmList.results);
      }),
      catchError( (error) => error)
    );
  }

  public getMoreFilms(): Subscription {
    this.count++;
    return this.http.get(`${this.nextPagePopularFilmUrl}${this.count}`)
      .subscribe((films: FilmInterface) => {
        console.log(films);
        this.updateFilmList(films.results);
      });
  }

  public updateFilmList(list: FilmListInterface[]): void {
    if (list && list.length) {
      this.filmListArray = this.filmListArray.concat(list);
      this.filmList$.next(this.filmListArray);

      console.log('films: ', this.filmListArray);
    }
  }

  public updateFilmListAfterSearch(result: FilmListInterface[]): void {
    if (result && result.length) {
      this.filmList$.next(result);
    }
  }

  public get getFilmList(): Observable<FilmListInterface[]> {
    return this.filmList$.asObservable();
  }

  public get getGenresList(): Observable<GenresListInterface[]> {
    return this.genresList$.asObservable();
  }

  public setFavoriteFilm(film: FilmListInterface): void {
    if (film.isFavorite) {
      this.favoriteFilmsArray.push(film.id);
      this.setFavoriteFilmsArray(film);
    } else {
      const index = this.favoriteFilmsArray.indexOf(film.id);
      this.favoriteFilmsArray.splice(index, 1);
    }

    localStorage.setItem('favoriteFilms', JSON.stringify(this.favoriteFilmsArray));

    this.favoriteFilmsCount$.next(this.favoriteFilmsArray.length);
  }

  public removeFromFavoriteFilms(film: FilmListInterface): void {
    this.favoriteFilmsList = this.favoriteFilmsList.filter((item) => item.id !== film.id);
    localStorage.setItem('favoriteFilmsList', JSON.stringify(this.favoriteFilmsList));

    this.favoriteFilmsCount$.next(this.favoriteFilmsList.length);
    this.favoriteFilmsArray$.next(this.favoriteFilmsList);
  }

  public getCountFavoriteFilm(): Observable<number> {
    return this.favoriteFilmsCount$.asObservable();
  }

  public getFavoriteFilmsArray(): Observable<FilmListInterface[]> {
    return this.favoriteFilmsArray$.asObservable();
  }

  private setFavoriteFilmsArray(film: FilmListInterface): any {

    this.favoriteFilmsList.push(film);
    this.favoriteFilmsArray$.next(this.favoriteFilmsList);
    localStorage.setItem('favoriteFilmsList', JSON.stringify(this.favoriteFilmsList));
  }

  public sortFilmByTitle(value): Subscription {
    const direction = !!parseInt(value, 10) ? -1 : 1;

    return this.getFilmList.subscribe((films: FilmListInterface[]) => {
      return films.sort(
        (a: FilmListInterface, b: FilmListInterface) => direction * (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1)
      );
    });
  }

  public initGenresList(): Observable<any> {
    return this.http.get(this.genresUrl).pipe(
      tap((genres: GenresInterface) => {
        console.log('genres: ', genres);
        this.genresList$.next(genres.genres);
      }),
      catchError( (error) => error)
    );
  }

  public getFilmById(id: number): any {
    if (this.filmListArray && this.filmListArray.length) {
      const currentFilm = this.filmListArray.find((film: FilmListInterface) => film.id === Number(id));
      this.currentFilm$.next(currentFilm);
    }
  }

  public getFilmObservable(): Observable<FilmListInterface> {
    return this.currentFilm$.asObservable();
  }

}
