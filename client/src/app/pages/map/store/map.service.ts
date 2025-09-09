import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { LngLatBoundsLike, LngLatLike, Map } from 'maplibre-gl';
import { CoordinatesResponse, GeoJsonFeature, LocationFormValue } from '@gemini-ai-bot/interfaces';

@Injectable({ providedIn: 'root' })
export class MapService {
  private http = inject(HttpClient);
  private stylesUrl = environment.apiMapUrl + '/style';
  private coordinatesUrl = environment.apiMapUrl + '/coordinates';
  private getGeometryUrl = environment.apiMapUrl + '/geometry';

  private map: Map | undefined;

  public setMap(map: Map) {
    this.map = map;
  }

  getMapStyle(): Observable<any> {
    return this.http.get<any>(this.stylesUrl);
  }

  getCoordinatesForPlace(
    data: LocationFormValue,
  ): Observable<CoordinatesResponse | GeoJsonFeature> {
    const { placeName, getGeometry } = data;

    const url = getGeometry ? this.getGeometryUrl : this.coordinatesUrl;

    return this.http.post<CoordinatesResponse | GeoJsonFeature>(url, {
      placeName,
    });
  }

  public flyTo(center: LngLatLike, zoom: number) {
    if (!this.map) {
      console.error('Map is not yet available!');
      return;
    }
    this.map.flyTo({ center, zoom });
  }

  public fitBounds(bounds: LngLatBoundsLike, padding = 40) {
    if (!this.map) {
      console.error('Map is not yet available!');
      return;
    }
    this.map.fitBounds(bounds, { padding });
  }
}
