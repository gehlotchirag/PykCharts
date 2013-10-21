function MarkerManager(e,t){var n=this;n.map_=e;n.mapZoom_=e.getZoom();n.projectionHelper_=new ProjectionHelperOverlay(e);google.maps.event.addListener(n.projectionHelper_,"ready",function(){n.projection_=this.getProjection();n.initialize(e,t)})}function GridBounds(e){this.minX=Math.min(e[0].x,e[1].x);this.maxX=Math.max(e[0].x,e[1].x);this.minY=Math.min(e[0].y,e[1].y);this.maxY=Math.max(e[0].y,e[1].y)}function ProjectionHelperOverlay(e){this.setMap(e);var t=8;var n=1<<t;var r=7;this._map=e;this._zoom=-1;this._X0=this._Y0=this._X1=this._Y1=-1}MarkerManager.prototype.initialize=function(e,t){var n=this;t=t||{};n.tileSize_=MarkerManager.DEFAULT_TILE_SIZE_;var r=e.mapTypes;var i=1;for(var s in r){if(r.hasOwnProperty(s)&&r.get(s)&&r.get(s).maxZoom==="number"){var o=e.mapTypes.get(s).maxZoom;if(o>i){i=o}}}n.maxZoom_=t.maxZoom||19;n.trackMarkers_=t.trackMarkers;n.show_=t.show||true;var u;if(typeof t.borderPadding==="number"){u=t.borderPadding}else{u=MarkerManager.DEFAULT_BORDER_PADDING_}n.swPadding_=new google.maps.Size(-u,u);n.nePadding_=new google.maps.Size(u,-u);n.borderPadding_=u;n.gridWidth_={};n.grid_={};n.grid_[n.maxZoom_]={};n.numMarkers_={};n.numMarkers_[n.maxZoom_]=0;google.maps.event.addListener(e,"dragend",function(){n.onMapMoveEnd_()});google.maps.event.addListener(e,"idle",function(){n.onMapMoveEnd_()});google.maps.event.addListener(e,"zoom_changed",function(){n.onMapMoveEnd_()});n.removeOverlay_=function(e){e.setMap(null);n.shownMarkers_--};n.addOverlay_=function(e){if(n.show_){e.setMap(n.map_);n.shownMarkers_++}};n.resetManager_();n.shownMarkers_=0;n.shownBounds_=n.getMapGridBounds_();google.maps.event.trigger(n,"loaded")};MarkerManager.DEFAULT_TILE_SIZE_=1024;MarkerManager.DEFAULT_BORDER_PADDING_=100;MarkerManager.MERCATOR_ZOOM_LEVEL_ZERO_RANGE=256;MarkerManager.prototype.resetManager_=function(){var e=MarkerManager.MERCATOR_ZOOM_LEVEL_ZERO_RANGE;for(var t=0;t<=this.maxZoom_;++t){this.grid_[t]={};this.numMarkers_[t]=0;this.gridWidth_[t]=Math.ceil(e/this.tileSize_);e<<=1}};MarkerManager.prototype.clearMarkers=function(){this.processAll_(this.shownBounds_,this.removeOverlay_);this.resetManager_()};MarkerManager.prototype.getTilePoint_=function(e,t,n){var r=this.projectionHelper_.LatLngToPixel(e,t);var i=new google.maps.Point(Math.floor((r.x+n.width)/this.tileSize_),Math.floor((r.y+n.height)/this.tileSize_));return i};MarkerManager.prototype.addMarkerBatch_=function(e,t,n){var r=this;var i=e.getPosition();e.MarkerManager_minZoom=t;if(this.trackMarkers_){google.maps.event.addListener(e,"changed",function(e,t,n){r.onMarkerMoved_(e,t,n)})}var s=this.getTilePoint_(i,n,new google.maps.Size(0,0,0,0));for(var o=n;o>=t;o--){var u=this.getGridCellCreate_(s.x,s.y,o);u.push(e);s.x=s.x>>1;s.y=s.y>>1}};MarkerManager.prototype.isGridPointVisible_=function(e){var t=this.shownBounds_.minY<=e.y&&e.y<=this.shownBounds_.maxY;var n=this.shownBounds_.minX;var r=n<=e.x&&e.x<=this.shownBounds_.maxX;if(!r&&n<0){var i=this.gridWidth_[this.shownBounds_.z];r=n+i<=e.x&&e.x<=i-1}return t&&r};MarkerManager.prototype.onMarkerMoved_=function(e,t,n){var r=this.maxZoom_;var i=false;var s=this.getTilePoint_(t,r,new google.maps.Size(0,0,0,0));var o=this.getTilePoint_(n,r,new google.maps.Size(0,0,0,0));while(r>=0&&(s.x!==o.x||s.y!==o.y)){var u=this.getGridCellNoCreate_(s.x,s.y,r);if(u){if(this.removeFromArray_(u,e)){this.getGridCellCreate_(o.x,o.y,r).push(e)}}if(r===this.mapZoom_){if(this.isGridPointVisible_(s)){if(!this.isGridPointVisible_(o)){this.removeOverlay_(e);i=true}}else{if(this.isGridPointVisible_(o)){this.addOverlay_(e);i=true}}}s.x=s.x>>1;s.y=s.y>>1;o.x=o.x>>1;o.y=o.y>>1;--r}if(i){this.notifyListeners_()}};MarkerManager.prototype.removeMarker=function(e){var t=this.maxZoom_;var n=false;var r=e.getPosition();var i=this.getTilePoint_(r,t,new google.maps.Size(0,0,0,0));while(t>=0){var s=this.getGridCellNoCreate_(i.x,i.y,t);if(s){this.removeFromArray_(s,e)}if(t===this.mapZoom_){if(this.isGridPointVisible_(i)){this.removeOverlay_(e);n=true}}i.x=i.x>>1;i.y=i.y>>1;--t}if(n){this.notifyListeners_()}this.numMarkers_[e.MarkerManager_minZoom]--};MarkerManager.prototype.addMarkers=function(e,t,n){var r=this.getOptMaxZoom_(n);for(var i=e.length-1;i>=0;i--){this.addMarkerBatch_(e[i],t,r)}this.numMarkers_[t]+=e.length};MarkerManager.prototype.getOptMaxZoom_=function(e){return e||this.maxZoom_};MarkerManager.prototype.getMarkerCount=function(e){var t=0;for(var n=0;n<=e;n++){t+=this.numMarkers_[n]}return t};MarkerManager.prototype.getMarker=function(e,t,n){var r=new google.maps.LatLng(e,t);var i=this.getTilePoint_(r,n,new google.maps.Size(0,0,0,0));var s=new google.maps.Marker({position:r});var o=this.getGridCellNoCreate_(i.x,i.y,n);if(o!==undefined){for(var u=0;u<o.length;u++){if(e===o[u].getPosition().lat()&&t===o[u].getPosition().lng()){s=o[u]}}}return s};MarkerManager.prototype.addMarker=function(e,t,n){var r=this.getOptMaxZoom_(n);this.addMarkerBatch_(e,t,r);var i=this.getTilePoint_(e.getPosition(),this.mapZoom_,new google.maps.Size(0,0,0,0));if(this.isGridPointVisible_(i)&&t<=this.shownBounds_.z&&this.shownBounds_.z<=r){this.addOverlay_(e);this.notifyListeners_()}this.numMarkers_[t]++};GridBounds.prototype.equals=function(e){if(this.maxX===e.maxX&&this.maxY===e.maxY&&this.minX===e.minX&&this.minY===e.minY){return true}else{return false}};GridBounds.prototype.containsPoint=function(e){var t=this;return t.minX<=e.x&&t.maxX>=e.x&&t.minY<=e.y&&t.maxY>=e.y};MarkerManager.prototype.getGridCellCreate_=function(e,t,n){var r=this.grid_[n];if(e<0){e+=this.gridWidth_[n]}var i=r[e];if(!i){i=r[e]=[];return i[t]=[]}var s=i[t];if(!s){return i[t]=[]}return s};MarkerManager.prototype.getGridCellNoCreate_=function(e,t,n){var r=this.grid_[n];if(e<0){e+=this.gridWidth_[n]}var i=r[e];return i?i[t]:undefined};MarkerManager.prototype.getGridBounds_=function(e,t,n,r){t=Math.min(t,this.maxZoom_);var i=e.getSouthWest();var s=e.getNorthEast();var o=this.getTilePoint_(i,t,n);var u=this.getTilePoint_(s,t,r);var a=this.gridWidth_[t];if(s.lng()<i.lng()||u.x<o.x){o.x-=a}if(u.x-o.x+1>=a){o.x=0;u.x=a-1}var f=new GridBounds([o,u]);f.z=t;return f};MarkerManager.prototype.getMapGridBounds_=function(){return this.getGridBounds_(this.map_.getBounds(),this.mapZoom_,this.swPadding_,this.nePadding_)};MarkerManager.prototype.onMapMoveEnd_=function(){this.objectSetTimeout_(this,this.updateMarkers_,0)};MarkerManager.prototype.objectSetTimeout_=function(e,t,n){return window.setTimeout(function(){t.call(e)},n)};MarkerManager.prototype.visible=function(){return this.show_?true:false};MarkerManager.prototype.isHidden=function(){return!this.show_};MarkerManager.prototype.show=function(){this.show_=true;this.refresh()};MarkerManager.prototype.hide=function(){this.show_=false;this.refresh()};MarkerManager.prototype.toggle=function(){this.show_=!this.show_;this.refresh()};MarkerManager.prototype.refresh=function(){if(this.shownMarkers_>0){this.processAll_(this.shownBounds_,this.removeOverlay_)}if(this.show_){this.processAll_(this.shownBounds_,this.addOverlay_)}this.notifyListeners_()};MarkerManager.prototype.updateMarkers_=function(){this.mapZoom_=this.map_.getZoom();var e=this.getMapGridBounds_();if(e.equals(this.shownBounds_)&&e.z===this.shownBounds_.z){return}if(e.z!==this.shownBounds_.z){this.processAll_(this.shownBounds_,this.removeOverlay_);if(this.show_){this.processAll_(e,this.addOverlay_)}}else{this.rectangleDiff_(this.shownBounds_,e,this.removeCellMarkers_);if(this.show_){this.rectangleDiff_(e,this.shownBounds_,this.addCellMarkers_)}}this.shownBounds_=e;this.notifyListeners_()};MarkerManager.prototype.notifyListeners_=function(){google.maps.event.trigger(this,"changed",this.shownBounds_,this.shownMarkers_)};MarkerManager.prototype.processAll_=function(e,t){for(var n=e.minX;n<=e.maxX;n++){for(var r=e.minY;r<=e.maxY;r++){this.processCellMarkers_(n,r,e.z,t)}}};MarkerManager.prototype.processCellMarkers_=function(e,t,n,r){var i=this.getGridCellNoCreate_(e,t,n);if(i){for(var s=i.length-1;s>=0;s--){r(i[s])}}};MarkerManager.prototype.removeCellMarkers_=function(e,t,n){this.processCellMarkers_(e,t,n,this.removeOverlay_)};MarkerManager.prototype.addCellMarkers_=function(e,t,n){this.processCellMarkers_(e,t,n,this.addOverlay_)};MarkerManager.prototype.rectangleDiff_=function(e,t,n){var r=this;r.rectangleDiffCoords_(e,t,function(t,i){n.apply(r,[t,i,e.z])})};MarkerManager.prototype.rectangleDiffCoords_=function(e,t,n){var r=e.minX;var i=e.minY;var s=e.maxX;var o=e.maxY;var u=t.minX;var a=t.minY;var f=t.maxX;var l=t.maxY;var c,h;for(c=r;c<=s;c++){for(h=i;h<=o&&h<a;h++){n(c,h)}for(h=Math.max(l+1,i);h<=o;h++){n(c,h)}}for(h=Math.max(i,a);h<=Math.min(o,l);h++){for(c=Math.min(s+1,u)-1;c>=r;c--){n(c,h)}for(c=Math.max(r,f+1);c<=s;c++){n(c,h)}}};MarkerManager.prototype.removeFromArray_=function(e,t,n){var r=0;for(var i=0;i<e.length;++i){if(e[i]===t||n&&e[i]===t){e.splice(i--,1);r++}}return r};ProjectionHelperOverlay.prototype=new google.maps.OverlayView;ProjectionHelperOverlay.prototype.LngToX_=function(e){return 1+e/180};ProjectionHelperOverlay.prototype.LatToY_=function(e){var t=Math.sin(e*Math.PI/180);return 1-.5/Math.PI*Math.log((1+t)/(1-t))};ProjectionHelperOverlay.prototype.LatLngToPixel=function(e,t){var n=this._map;var r=this.getProjection().fromLatLngToDivPixel(e);var i={x:~~(.5+this.LngToX_(e.lng())*(2<<t+6)),y:~~(.5+this.LatToY_(e.lat())*(2<<t+6))};return i};ProjectionHelperOverlay.prototype.draw=function(){if(!this.ready){this.ready=true;google.maps.event.trigger(this,"ready")}}