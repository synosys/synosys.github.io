/* Locale formatting */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const locale = urlParams.get('lang') === 'en' ? 'en-CA' : 'de-DE'

// const useEnglish = locale === 'en' ? true : false

const dateNames = locale == 'de-DE' ? {
    MMMM: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    MMM: ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
    WWWW: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    WWW: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
} : null

const numFormat = new Intl.NumberFormat(locale, { maximumSignificantDigits: 4 })

const getVal = (u, val) => val ? numFormat.format(val) : ''

const config = {
    title: locale == 'en-CA' ? 'Number of Contacts' : 'Anzahl an Kontakten',
    'CX': {
        label: locale == 'en-CA' ? 'Contact Index' : 'Kontaktindex',
        color: 'teal',
        transparentColor: 'rgba(0, 128, 128, 0.25)'
    },
    'k_std_7davg': {
        label: locale == 'en-CA' ? 'Standard Deviation' : 'Standardabweichung',
        color: 'teal',
        transparentColor: 'rgba(0, 128, 128, 0.25)'
    },
    'k_7davg': {
        label: locale == 'en-CA' ? 'Average' : 'Mittelwert',
        color: '#eb822d',
        transparentColor: 'rgba(235, 130, 45, 0.25)'
        // color: 'rgba(255, 0, 0, 0.5)'
    }
    // 'k_7davg': {
    //     label: locale == 'en-CA' ? 'Average Contacts' : 'Durchschnittliche Kontakte',
    //     color: '#eb822d'
    // }
}

/* parse CSV */

const transformArray = (data) => {
    const timeseries = {}
    Object.keys(data[0]).forEach((key) => {
        timeseries[key] = data.map((d) => d[key])
    })
    return timeseries
}
Papa.parse(`contactindex-data/data/cx_nation_processed.csv?${Math.floor(Math.random()*1000)}`, {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (file) => {
        file.data = file.data.filter((d) => d.date && d.date !== null)
        const data = transformArray(file.data)
        const dates = data.date.map((datestring, i) => Date.parse(datestring) / 1000)
        generateChart([dates, /*data['k'],*/ data['k_std'], data['k_std_7davg'], data['k_7davg'], data['k']])
    }
})

let w = Math.min(window.innerWidth, 860)
let h = Math.max(w / 2, 300)

function generateChart(_data) {

    let opts = {
        title: "",
        id: "chart1",
        class: "my-chart",
        width: w,
        height: h,
        fmtDate: tpl => uPlot.fmtDate(tpl, dateNames),
        plugins: [
            tooltipsPlugin(),
        ],
        legend: { show: false },
        cursor: {
            y: false,
            //lock: true,
            points: {
                size: (u, seriesIdx) => seriesIdx == 1 || seriesIdx == 4 ? 0 : 10,
                width: (u, seriesIdx) => seriesIdx == 1 || seriesIdx == 4 ? 0 : 2
            }
        },
        series: [
            {
                // value: "{DD}.{MM}.{YYYY}",
                value: (val, t) => t ? new Date(t * 1000).toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' }) : '',
                label: 'date'
            },
            { label: 'Raw Contact Index', width: 0.6, stroke: config['k_std_7davg'].transparentColor, width: 2,/*dash: [10, 5],*/ value: getVal },
            { label: config['k_std_7davg'].label, stroke: config['k_std_7davg'].color, width: 2, value: getVal },
            { label: config['k_7davg'].label, stroke: config['k_7davg'].color, width: 2, value: getVal, scale: 'contacts' },
            { label: config['k_7davg'].label, stroke: config['k_7davg'].transparentColor, width: 2,/*dash: [10, 5],*/ value: getVal, scale: 'contacts' }
        ],
        axes: [
            {
                scale: 'x', grid: { show: false },
                labelFont: "18px Helvetica Neue, Arial",
                font: '12px Helvetica Neue, Arial',
                values: [
                    // tick incr          default           year                             month    day                        hour     min                sec       mode
                    [3600 * 24 * 365, "{YYYY}", null, null, null, null, null, null, 1],
                    [3600 * 24 * 28, "{MMM}", "\n{YYYY}", null, null, null, null, null, 1],
                    [3600 * 24, "{DD}.{MM}", "\n{YYYY}", null, null, null, null, null, 1],
                    [3600, "", "\n{DD}.{MM}.{YYYY}", null, "\n{DD}.{MM}", null, null, null, 1],
                    // [60,                "{h}:{mm}{aa}",   "\n{M}/{D}/{YY}",                null,    "\n{M}/{D}",               null,    null,              null,        1],
                    // [1,                 ":{ss}",          "\n{M}/{D}/{YY} {h}:{mm}{aa}",   null,    "\n{M}/{D} {h}:{mm}{aa}",  null,    "\n{h}:{mm}{aa}",  null,        1],
                    // [0.001,             ":{ss}.{fff}",    "\n{M}/{D}/{YY} {h}:{mm}{aa}",   null,    "\n{M}/{D} {h}:{mm}{aa}",  null,    "\n{h}:{mm}{aa}",  null,        1],
                ],
            },
            {
                scale: 'y',
                // label: `${config.title} - ${config['k_std_7davg'].label}`,
                stroke: config['k_std_7davg'].color,
                // grid: { show: false },
                labelFont: "bold 12px Helvetica Neue, Arial",
                // stroke: '#000',
                grid: {
                    dash: [3, 6],
                    stroke: '#000',
                    width: 0.5
                },
                // stroke: config['k_std_7davg'].color
            },
            {
                scale: 'contacts',
                side: 1,
                // label: `${config.title} - ${config['k_7davg'].label}`,
                labelFont: "bold 12px Helvetica Neue, Arial",
                stroke: config['k_7davg'].color,
                // grid: {
                //     dash: [3, 6],
                //     stroke: '#000',
                //     width: 0.5
                // },
                grid: { show: false }
            }
        ],
        scales: {
            y: {
                range: (u, dataMin, dataMax) => {
                    // console.log(u)
                    return [0, Math.min(dataMax, 120)]
                }
            }

        }
    };

    let uplot = new uPlot(opts, _data, document.body);
    window.addEventListener('resize', () => {
        // console.log('resized')
        w = Math.min(window.innerWidth, 860)
        h = Math.max(w / 2, 300)
        uplot.setSize({ width: w, height: h })
    })
}

/* Tooltip */

function tooltipsPlugin(opts) {
    function init(u, opts, data) {
        let over = u.over;

        let ttc = u.cursortt = document.createElement("div");
        ttc.className = "tooltip";
        ttc.textContent = "";
        ttc.style.pointerEvents = "none";
        ttc.style.position = "absolute";
        ttc.style.fontSize = '14px'
        over.appendChild(ttc);

        function hideTips() {
            // ttc.style.display = 'none'
            // const left = Math.max(0, w - 300)
            const left = 40
            ttc.style.top = '15px'
            ttc.style.left = `${left}px`
            ttc.innerHTML = renderTooltip(u, true)
        }

        function showTips() {
            ttc.style.display = null;
        }

        over.addEventListener("mouseleave", () => {
            if (!u.cursor._lock) {
                hideTips();
            }
        });

        over.addEventListener("mouseenter", () => {
            showTips();
        });

        hideTips()

    }

    function renderTooltip(u, hidden = false) {
        const content = u.series.map((s, i) => {
            if (i === 0) {
                if (!hidden) return `<div style="margin-bottom:0.4rem;">${s.value(u, u.data[i][u.cursor.idx])}</div>`
                return ''
            }
            if (i === 1 || i === 4) return ''
            return ` <div style=""><span style="background-color: ${i == 3 ? config['k_7davg'].color : config['k_std_7davg'].color}; margin-right:6px; padding: 2px;"></span>${s.label}${hidden ? '' : `: ${s.value(u, u.data[i][u.cursor.idx])}`}</div>`
        }).join('')
        return `<div style=" font-weight: bold">${config.title}</div>${content}`
    }
    function setCursor(u) {
        const { left, top, idx } = u.cursor;
        const l = Math.min(left, w - 330)
        u.cursortt.style.left = l + "px";
        u.cursortt.style.top = top + "px";

        u.cursortt.innerHTML = renderTooltip(u)
    }

    return {
        hooks: {
            init,
            setCursor
        },
    };
}