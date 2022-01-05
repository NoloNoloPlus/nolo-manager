<script>

import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: {
    x: {
      type: Array,
      required: true
    },
    y: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    nDays: {
      type: Number,
      default: 10
    },
    yPrecision: {
      type: Number,
      default: 0
    }
  },
  watch: {
    x () {
      this.displayGraph()
    },
    y () {
      this.displayGraph()
    }
  },
  mounted () {
    this.displayGraph()
  },
  methods: {
    displayGraph () {
      if (this.x) {
        this.renderChart(
          {
            labels: this.x.slice(Math.max(0, this.x.length - this.nDays), this.nDays),
            datasets: [
              {
                label: this.label,
                data: this.y.slice(Math.max(0, this.x.length - this.nDays), this.nDays),
                borderColor: '#3cba9f'
              }
            ]
          },
          {
            responsive: false,
            maintainAspectRatio: true,
            legend: {
              labels: {
                fontColor: 'black'
              }
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    fontColor: 'black',
                    precision: this.yPrecision
                  }
                }
              ],
              xAxes: [
                {
                  ticks: {
                    fontColor: 'black'
                  }
                }
              ]
            }
          }
        )
      }
    }
  }
}

</script>