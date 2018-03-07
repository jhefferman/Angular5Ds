import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'app';

    public chart_width = 800;
    public chart_height = 400;
    public bar_padding = 5;
    public svg;
    public x_scale;
    public y_scale;

  constructor() {
  }

  ngAfterViewInit() {
    var data = [
      { key: 0, num: 6 },
      { key: 1, num: 20 },
      { key: 2, num: 21 },
      { key: 3, num: 14 },
      { key: 4, num: 2 },
      { key: 5, num: 30 },
      { key: 6, num: 7 },
      { key: 7, num: 16 },
      { key: 8, num: 25 },
      { key: 9, num: 5 },
      { key: 10, num: 11 },
      { key: 11, num: 28 },
      { key: 12, num: 10 },
      { key: 13, num: 26 },
      { key: 14, num: 9 }
    ];
    var key = (d) => {
      return d.key;
    };

    // Create SVG Element
    this.chart_width = 800;
    this.chart_height = 400;
    this.bar_padding = 5;
    this.svg = d3.select('#chart')
      .append('svg')
      .attr('width', this.chart_width)
      .attr('height', this.chart_height);

    // Create Scales
    // 800 / 15 = 53.33
    // 0, 53.33, 106.66 

    this.x_scale = d3.scaleBand<number>()
      .domain(d3.range(data.length))
      .rangeRound([0, this.chart_width])
      .paddingInner(0.05);
    this.y_scale = d3.scaleLinear()
      .domain([
        0, d3.max(data, (d) => {
          return d.num;
        })
      ])
      .range([0, this.chart_height]);

    // Bind Data and create bars
    this.svg.selectAll('rect')
      .data(data, key)
      .enter()
      .append('rect')
      .attr('x', (d, i) => {
        return this.x_scale(i);
      })
      .attr('y', (d) => {
        return this.chart_height - this.y_scale(d.num);
      })
      .attr('width', this.x_scale.bandwidth())
      .attr('height', (d) => {
        return this.y_scale(d.num);
      })
      .attr('fill', '#7ED26D');

    // Create Labels
    this.svg.selectAll('text')
      .data(data, key)
      .enter()
      .append('text')
      .text((d) => {
        return d.num;
      })
      .attr('x', (d, i) => {
        return this.x_scale(i) + this.x_scale.bandwidth() / 2;
      })
      .attr('y', (d) => {
        return this.chart_height - this.y_scale(d.num) + 15;
      })
      .attr('font-size', 14)
      .attr('fill', '#fff')
      .attr('text-anchor', 'middle');

    
    // Events
    d3.select('.update').on("click", () => {
      console.log(1);
      // Reverse Data
      // data.reverse();
      data[0].num = 50;
      this.y_scale.domain([0, d3.max(data, (d) => {
        return d.num;
      })]);

      //Update Bars
      this.svg.selectAll("rect")
        .data(data, key)
        .transition()
        .delay((d, i) => {
          return i / data.length * 1000;
        })
        .duration(1000)
        .ease(d3.easeElasticOut)
        .attr("y", (d) => {
          return this.chart_height - this.y_scale(d.num);
        })
        .attr("height", (d) => {
          return this.y_scale(d.num);
        });

      // Update Labels
      this.svg.selectAll("text")
        .data(data, key)
        .transition()
        .delay((d, i) => {
          return i / data.length * 1000;
        })
        .duration(1000)
        .ease(d3.easeElasticOut)
        .text((d) => {
          return d.num;
        })
        .attr("x", (d, i) => {
          return this.x_scale(i) + this.x_scale.bandwidth() / 2;
        })
        .attr("y", (d) => {
          return this.chart_height - this.y_scale(d.num) + 15;
        })
    });

    // Add Data
    d3.select('.add').on('click', () => {
      // Add New Data
      var new_num = Math.floor(Math.random() * d3.max(data, (d) => {
        return d.num;
      }));
      data.push({
        key: data[data.length - 1].key + 1, num: new_num
      });

      // Update Scales
      this.x_scale.domain(d3.range(data.length));
      this.y_scale.domain([0, d3.max(data, (d) => {
        return d.num;
      })]);

      // Select Bars
      var bars = this.svg.selectAll('rect').data(data, key);

      // Add New Bar
      bars.enter()
        .append("rect")
        .attr('x', (d, i) => {
          return this.x_scale(i);
        })
        .attr('y', this.chart_height)
        .attr('width', this.x_scale.bandwidth())
        .attr('height', 0)
        .attr('fill', '#7ED26D')
        .merge(bars)
        .transition()
        .duration(1000)
        .attr("x", (d, i) => {
          return this.x_scale(i);
        })
        .attr("y", (d) => {
          return this.chart_height - this.y_scale(d.num);
        })
        .attr("width", this.x_scale.bandwidth())
        .attr("height", (d) => {
          return this.y_scale(d.num);
        });

      // Add New Labels
      var labels = this.svg.selectAll('text').data(data, key);
      labels.enter()
        .append("text")
        .text((d) => {
          return d.num;
        })
        .attr('x', (d, i) => {
          return this.x_scale(i) + this.x_scale.bandwidth() / 2;
        })
        .attr('y', this.chart_height)
        .attr("font-size", "14px")
        .attr("fill", "#fff")
        .attr("text-anchor", "middle")
        .merge(labels)
        .transition()
        .duration(1000)
        .attr("x", (d, i) => {
          return this.x_scale(i) + this.x_scale.bandwidth() / 2;
        })
        .attr("y", (d) => {
          return this.chart_height - this.y_scale(d.num) + 15;
        })
    });

    // Remove Data
    d3.select('.remove').on('click', () => {
      // Remove first item
      data.shift();

      // Update Scales
      this.x_scale.domain(d3.range(data.length));
      this.y_scale.domain([0, d3.max(data, (d) => {
        return d.num;
      })]);

      // Select Bars
      var bars = d3.selectAll('rect').data(data, key);

      // Update Bars
      bars.transition()
        .duration(500)
        .attr("x", (d, i) => {
          return this.x_scale(i);
        })
        .attr("y", (d) => {
          return this.chart_height - this.y_scale(d.num);
        })
        .attr("width", this.x_scale.bandwidth())
        .attr("height", (d) => {
          return this.y_scale(d.num);
        });

      // Remove bar
      bars.exit()
        .transition()
        .attr('x', -this.x_scale.bandwidth())
        .remove();

      // Select Labels
      var labels = d3.selectAll('text').data(data, key);

      // Update Labels
      labels.transition()
        .duration(500)
        .attr("text-anchor", "start")
        .attr("x", (d, i) => {
          return this.x_scale(i) + this.x_scale.bandwidth() / 2;
        })
        .attr("y", (d) => {
          return this.chart_height - this.y_scale(d.num) + 15;
        });

      labels.exit()
        .transition()
        .attr('x', -this.x_scale.bandwidth())
        .remove();
    });
    
  }

}
