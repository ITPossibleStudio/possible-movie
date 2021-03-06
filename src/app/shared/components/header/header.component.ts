import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { MenuItemInterface } from '../../interfaces/menu-item.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'exp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('checkboxTemplate') checkboxTemplate: ElementRef;
  @ViewChild('backdropTemplate') backdropTemplate: ElementRef;

  public linkId = 0;
  public isLogged: boolean;
  public isMenuOpened: boolean;

  links: MenuItemInterface[] = [
    { path: '/welcome', label: 'Main Page', active: 'button-active', icon: 'home', id: 0 },
    { path: '/films', label: 'All Films', active: 'button-active', icon: 'list_alt', id: 1 },
    { path: '/actors', label: 'All Actors', active: 'button-active', icon: 'face', id: 2 },
    { path: '/favorite-films', label: 'Favorite', active: 'button-active', icon: 'stars', id: 3 },
    // { path: '/login', label: 'LogIn', active: 'button-active', icon: 'login', id: 4 },
    // { path: '/logout', label: 'LogOut', active: 'button-active', icon: '', id: 5 }
  ];

  constructor(
    private renderer: Renderer2,
    private authService: AuthService) {
  }

  public ngOnInit(): void {
    this.isLogged = this.authService.isLoggedIn();
  }

  public chooseLink(id: number): void {
    this.linkId = id;
    this.hideMenuAndBackdrop();
  }

  public backdrop(event: MouseEvent): void {
    event.preventDefault();

    this.hideMenuAndBackdrop();
    this.isMenuOpened = !this.isMenuOpened;
  }

  public menuClick(): void {
    this.checkboxTemplate.nativeElement.checked ?
      this.renderer.setStyle(this.backdropTemplate.nativeElement, 'display', 'block')
      : this.renderer.setStyle(this.backdropTemplate.nativeElement, 'display', 'none');
  }

  private hideMenuAndBackdrop(): void {
    this.checkboxTemplate.nativeElement.checked = false;
    this.renderer.setStyle(this.backdropTemplate.nativeElement, 'display', 'none');
  }
}
