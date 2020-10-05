import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Subscription } from 'rxjs';

import { FilmInterface } from '../../../../film-catalog/interfaces/film.interface';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'exp-film-item',
  templateUrl: './film-item.component.html',
  styleUrls: ['./film-item.component.scss']
})
export class FilmItemComponent implements OnInit, OnDestroy {

  @Input() film: FilmInterface;
  @Input() genresList: any;

  @Output() favoriteFilm: EventEmitter<FilmInterface> = new EventEmitter<FilmInterface>();

  public isFavoriteFilm: boolean;
  public imagePath: string;
  public genres = [];

  private subscription: Subscription = new Subscription();

  constructor(private dataService: DataService) { }

  public ngOnInit(): void {
    this.fetchPosterPath();
    this.fetchGenres();
  }

  private fetchPosterPath(): string {
    return this.imagePath = 'https://image.tmdb.org/t/p/w500' + this.film.poster_path;
  }

  public toggleFavoriteFilm(favoriteFilm: FilmInterface): void {
    this.isFavoriteFilm = !this.isFavoriteFilm;
    favoriteFilm.isFavorite = this.isFavoriteFilm;
    this.favoriteFilm.emit(favoriteFilm);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private fetchGenres(): void {
    this.film.genre_ids.forEach((genre: number) => {

      const item = this.genresList.filter((x) => x.id === genre);
      this.genres.push(item[0].name);
    });
  }

}
