/**
 * @class
 * @description
 * Wrapper for HTML5 audio.
 */
import {Injectable, NgZone} from '@angular/core';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';

/*declare const AudioContext: any;
declare const webkitAudioContext: any;
// TODO Abstract visualizer to separate class
declare const d3: any;*/

@Injectable()
export class AudioAPIWrapper {

    _audio: any;
    _audioSrc: any;
    _analyser: any;
    //_audioCtx = new (AudioContext || webkitAudioContext)();
    _svg: any;

    constructor(private _zone: NgZone) {
        this._createAudio();
    }

    /*visualize() {
        const self = this;
        const frequencyData = new Uint8Array(200);
        const svgHeight = 300;
        const svgWidth = 1200;
        const barPadding = 1;

        function createSvg(parent, height, width) {
            return d3.select(parent).append('svg').attr('height', height).attr('width', width);
        }

        if (!self._svg) {
            // TODO DO this better
            self._svg = createSvg('#audio-visualizer', svgHeight, svgWidth);
        }
        // Create our initial D3 chart.
        self._svg.selectAll('rect')
            .data(frequencyData)
            .enter()
            .append('rect')
            .attr('x', function (d, i) {
                return i * (svgWidth / frequencyData.length);
            })
            .attr('width', svgWidth / frequencyData.length - barPadding);
        // Continuously loop and update chart with frequency data.
        function renderChart() {
            requestAnimationFrame(renderChart);
            // Copy frequency data to frequencyData array.
            if (self._analyser) {
                self._analyser.getByteFrequencyData(frequencyData);
                // Update d3 chart with new data.
                self._svg.selectAll('rect')
                    .data(frequencyData)
                    .attr('y', function (d) {
                        return svgHeight - d;
                    })
                    .attr('height', function (d) {
                        return d;
                    })
                    .attr('fill', function (d) {
                        return 'rgb(0, 0, ' + d + ')';
                    });
            }

        }

        // Run the loop
        renderChart();
    }*/

    play() {
        if (!this._audio.src) { alert('Select song'); return; }
        const playPromise = this._audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Automatic playback started!
            }).catch(error  => {
                console.log('audio api wrapper', error);
                // Automatic playback failed.
                // Show a UI element to let the user manually start playback.
            });
        }
        // Comment visualization out for now.
        // this.Visualize();
    }

    pause() {
        this._audio.pause();
    }

    stop() {
        this._audio.pause();
        this._audio.currentTime = 0;
    }

    load(url) {
        this._createAudio();
        this._audio.pause();
        this._audio.crossOrigin = 'anonymous';
        this._audio.src = url;
        this._audio.load();
        return this;
    }

    loop(val: boolean = true) {
        this._audio.loop = val;
    }

    bindAudioEvent<E>(eventName: string): Observable<E> {
        const self = this;
        return Observable.create((observer: Observer<E>) => {
            self._audio.addEventListener(eventName, (args: E) => {
                self._zone.run(() => observer.next(args));
            });
        });
    }

    _createAudio(): void {
        if (!this._audio) {
            this._audio = new Audio();
            this._audio.autoplay = false;
            this._audio.preload = 'none';
            this._audio.autobuffer = true;
        }

        /*if (!this._audioSrc) {
            this._audioSrc = this._audioCtx.createMediaElementSource(this._audio);
        }

        if (!this._analyser && this._audioSrc.connect) {
            // Bind our analyser to the media element source.
            this._analyser = this._audioCtx.createAnalyser();
            this._audioSrc.connect(this._analyser);
            this._audioSrc.connect(this._audioCtx.destination);
        }*/
    }

    _destroyAudio(): void {
        if (this._audio) {
            this._audio.pause();
            this._audio.unbindEvents();
            try {
                this._audio.src = '';
            } finally {
                delete this._audio;
            }
        }
    }

    _tests(): Boolean {
        const elem = document.createElement('audio');
        let bool: any = false;
        try {
            if (bool = !!elem.canPlayType) {
                bool = new Boolean(bool);
                bool.ogg = elem.canPlayType('audio/ogg; codecs="vorbis"');
                bool.mp3 = elem.canPlayType('audio/mpeg;');
                bool.wav = elem.canPlayType('audio/wav; codecs="1"');
                bool.m4a = elem.canPlayType('audio/x-m4a;') || elem.canPlayType('audio/aac;');
            }
        } catch (e) {
        }
        return bool;
    }
}