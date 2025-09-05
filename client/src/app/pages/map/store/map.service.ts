import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { LngLatLike, Map } from 'maplibre-gl';

@Injectable({providedIn: 'root'})
export class MapService {
  private http = inject(HttpClient);
  private stylesUrl = environment.apiMapUrl + '/style';
  private coordinatesUrl = environment.apiMapUrl + '/coordinates';

  private map: Map | undefined;

  public setMap(map: Map) {
    this.map = map;
  }



  getMapStyle(): Observable<any> {
    return this.http.get<any>(this.stylesUrl);
  }

  getCoordinatesForPlace(placeName: string): Observable<{ latitude: number; longitude: number }> {
    return this.http.post<{ latitude: number; longitude: number }>(
      this.coordinatesUrl,
      { placeName }
    );
  }


  public flyTo(center: LngLatLike, zoom: number) {
    if (!this.map) {
      console.error('Map is not yet available!');
      return;
    }
    this.map.flyTo({ center, zoom });
  }
}
