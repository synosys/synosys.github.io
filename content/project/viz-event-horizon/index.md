---
title: Spreading Routes on a Global Scale
abstract: 
summary: "This interactive visualization illustrates the most probable spreading routes of a pandemic with and arbitrary initial outbreak location that you can choose. The visualization implements the ideas of series of papers that introduce and discuss the concept of effective distance in complex, network-driven contagion phenomena."

tags:
- interactive visualization
- networks
- global mobility
- event horizon
- COVID-19
- epidemics
- pandemics

date: "2021-07-10"

# Optional external URL for project (replaces project detail page).
#external_link: https://rocs.hu-berlin.de/viz/sgb

image:
  caption: Most Probable Spreading Route on the Worldwide Air-Transportation Network
  focal_point: Smart

links:
- icon: link
  icon_pack: fas
  name: Read More
  url: /project/viz-event-horizon/
  
- icon: link
  icon_pack: fas
  name: Start Visualization
  url: https://rocs.hu-berlin.de/viz/sgb

  
authors:
- dirk
- Dirk Helbing


---
## The visualization

You can start and explore the visualization by clicking this button

{{< cta cta_text="Start Visualization" cta_link="https://rocs.hu-berlin.de/viz/sgb" cta_new_tab="false" >}}

In order to appreciate it and understand what's going on, however, you may want to read the background information below.


## Background

In 2013 [Dirk Brockmann](/authors/dirk) and [Dirk Helbing](https://de.wikipedia.org/wiki/Dirk_Helbing) published a paper in Science **([The hidden geometry of complex, network-driven contagion phenomena, Science 342 (6164), 1337-1342
2013)](/publication/brockmann-2013-hidden/)** ) in which they showed that spreading processes that unfold on heterogeneous networks can be understood better, if the notion of conventional distance is replaced by an effective distance that is derived from the strength of the connections in the network. 

For example, if you want to understand how a pandemic spreads on the worldwide air-transportation network traditional geographic distance, which is the foundation of traditional maps that we look at every day, is replace by effective distance, we can understand the spreading patterns better. Roughly speaking, the effective distance from an airport _**A**_ to _**B**_ is large if few people travel from _**A**_ to _**B**_, and it is small if a lot of passengers travel from _**A**_ to _**B**_. Under the hood, it's a bit more complicated than this, but never mind the details. If you are interested in the details, have a look at [**the paper**](/publication/brockmann-2013-hidden/).

When viewed on a traditional map, real pandemics or computer simulated versions typically exhibit spatially incoherent and complicated patterns, because the worldwide air-transportation network connects places that are very far apart and also because the mobility network has a very complicated internal structure. You don't see generic traveling waves, that you may expect if no long-range traffic would occur.

However, if you let go of the traditional way of looking at these pattern, replace geographic distance by effective distance, the spreading patterns turn into generic traveling waves, as you can see in this video.

{{< youtube ECJ2DdPhMxI >}}

The video illustrates a computer simulated hypothetical pandemic with an initial outbreak location in Atlanta in the USA. Both panels show the same simulation. The right panel illustrates the spreading pattern in the conventional map. The left panel, shows the pattern using effective distance, which in this case is the distance to the origin.

The tree-like structure that you see compiles the most probable spreading routes. And these routes are illustrated in the interactive visualization.

## References

{{< cite page="/publication/brockmann-2013-hidden" view="4" >}}

{{< cite page="/publication/iannelli-2017-effective" view="4" >}}
