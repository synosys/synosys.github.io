const html = require('nanohtml')
const loadData = require('./src/load-data.js')
const createChart = require('./src/chart.js')
const { config, getDate } = require('./src/config.js')

loadData(`contactindex-data/data/cx_state_processed.csv?${Math.floor(Math.random() * 1000)}`, (d) => {
    initChart(d)
})

function initChart({ data, dates }) {
    const state = { dataset: 'k_std_', sync: false }
    const test = data[0]

    const container = html`<div style="display:flex; flex-wrap:wrap; overflow-y:auto; overflow-x: hidden; height:calc(100% - 40px);"></div>`
    const buttons = ['k_std_', 'k_'].map((key, i) => html`<div class="button ${key === state.dataset ? 'selected' : ''}" onclick=${() => updateDataset(key, i)}>${config[key].label}</div>`)
    const toggle = html`<input style="margin-left:20px;" type="checkbox" id="sync" name="sync" checked=${state.sync} onchange=${(e) => { setYSync(e.target.checked)}}>`
    const header = html`
        <div style="display:flex;align-items:center;height:40px"> 
            <div class="title">${config.title}</div> 
            ${buttons}
            ${toggle}
            <label>${config.syncLabel}</label>
        </div>`

    let w = Math.max(window.innerWidth / 4, 200) - 20
    let h = 200
    let testSync = uPlot.sync("test")
    const charts = data.map((land, i) => {
        const div = document.createElement('div')
        div.style.width = `${w}px`
        const series = [dates, land.data['k_std_'], land.data['k_std__7davg']]
        const chart = createChart(series, {
            w: w, 
            h: h, 
            parent: container, 
            sync: testSync, 
            label: land.label, 
            index: i, 
            onCursorUpdate: i == 0 ? (i) => {
                updateLegends(i)
            } : () => { },
            onSelectUpdate: i == data.length - 1 ? (i) => {
                //updateLegends(i)
              //  console.log('update selection')
                updateYRange(i)
            } : () => { }
        })
        testSync.sub(chart)
        window.chart = chart
        return chart
    })


    function updateDataset(key, index) {
        const { color, transparentColor } = config[key]

        state.dataset = key
        buttons.forEach((button) => {
            button.classList.remove("selected")
            button.style.backgroundColor = ''
        })
        buttons[index].classList.add("selected")
        buttons[index].style.backgroundColor = transparentColor
        // console.log('header', header)
        charts.forEach((chart, i) => {
            const d = data[i]
            chart.setData([dates, d.data[key], d.data[`${key}_7davg`]])
            chart.updateColor(color, transparentColor)
         //   console.log(chart.scales.y.max)
        })
       // console.log(charts)
    }

    function setYSync(val) {
        state.sync = val
        updateYRange()
    }

    // calculate max y-value of all charts
    function updateYRange() {
       // console.log(charts[0].series[0].idxs, charts[0])
       
        setTimeout(() => {
            const range = charts[0].series[0].idxs
            const start = range[0]
            const end = range[1]
            let overallMax = 0
            let overallMin = 1000
            if(state.sync === true) {
                charts.forEach((chart) => {
                    const d = chart.data[2]
                    let max = d[start]
                    let min = d[start]
                    let i = start
                    while(i <= end) {
                        if(min === null) min = d[i]
                        if(d[i] < min) min = d[i]
                        if(d[i] > max) max = d[i]
                        i++
                    }
                //   console.log('max', max)
                    if(max > overallMax) overallMax = max
                    if(min < overallMin) overallMin = min
                })
                overallMax += 2 // padding
                if(overallMin > 2) overallMin -= 2
                overallMin = 0
                charts.forEach((chart) => {
               
                chart.updateYRange(overallMin, overallMax)
                chart.setScale('y', {min: overallMin, max: overallMax})
            //    chart.scales.y.range(chart, 0, overallMax)
                })
            } else {
                console.log('autoscaling', start, end)

                charts.forEach((chart) => {
                    const d = chart.data[2]
                    let max = d[start]
                    let min = d[start]
               //     console.log(min, 'min', chart)
                    let i = start
                    while(i <= end) {
                        if(min === null) min = d[i]
                        if(d[i] > max) max = d[i]
                        if(d[i] < min) min = d[i]
                        i++
                    }
                    max += 2
                    if(min > 2) min -= 2
                    chart.updateYRange(min, max)
                    chart.setScale('y', {min: min, max: max})
                    //  chart.scales.y.range(chart, min, max)

                })
            }
        }, 50)
    }
    function updateLegends(i, d = 1) {
       // console.log('updating', i)
      // console.log(charts[0])
        const date = getDate(true, charts[0].data[0][i])
        charts.forEach((chart) => {
            //console.log(chart.scales.y.max)
            chart.updateLegend(i, date)
        })
    }

    function updateSize() {
        let w = 200
        let sw = window.innerWidth
        if (sw < 600) {
            w = sw / 2 - 20
        } else if (sw < 700) {
            w = sw / 3 - 15
        } else {
            w = sw / 4 - 20
        }
        let h = 180
        charts.forEach((chart, i) => {
            chart.updateSize(w, h)
        })
    }

    window.addEventListener('resize', () => {
        updateSize()
    })

    const main = html`<div style="height:100%;position:absolute">
    ${header}
    ${container}
    </div>`

    document.body.appendChild(main)

    updateDataset('k_std_', 0)
    updateSize()
}

