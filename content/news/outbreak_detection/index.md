---
title: "New paper out: Finding disease outbreak locations from human mobility data"
subtitle: ""
abstract: ""

authors:

- frank
- dirk

tags:
- COVID-19
- human mobility
- disease dynamics
- complex networks
- mobility networks
- pandemics
- epidemics
- outbreak reconstruction

summary: ""

categories: []
date: "2021-10-19"

lastMod: "2021-10-19"

featured: false

draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
image:
caption: ""
focal_point: ""

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references
#   `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.

---

In this paper we investigated how much information on individual mobility patterns is required
to reconstruct the origin of an outbreak from spatially distributed cases.

It turns out: not so much.

The paper is available [**here**](https://epjdatascience.springeropen.com/articles/10.1140/epjds/s13688-021-00306-6#citeas).

**Here's the abstract:**

---

Finding the origin location of an infectious disease outbreak quickly is crucial in
mitigating its further dissemination. Current methods to identify outbreak locations
early on rely on interviewing affected individuals and correlating their movements,
which is a manual, time-consuming, and error-prone process. Other methods such as
contact tracing, genomic sequencing or theoretical models of epidemic spread offer
help, but they are not applicable at the onset of an outbreak as they require highly
processed information or established transmission chains. Digital data sources such as
mobile phones offer new ways to find outbreak sources in an automated way. Here,
we propose a novel method to determine outbreak origins from geolocated
movement data of individuals affected by the outbreak. Our algorithm scans
movement trajectories for shared locations and identifies the outbreak origin as the
most dominant among them. We test the method using various empirical and
synthetic datasets, and demonstrate that it is able to single out the true outbreak
location with high accuracy, requiring only data of N = 4 individuals. The method can
be applied to scenarios with multiple outbreak locations, and is even able to estimate
the number of outbreak sources if unknown, while being robust to noise. Our
method is the first to offer a reliable, accurate out-of-the-box approach to identify
outbreak locations in the initial phase of an outbreak. It can be easily and quickly
applied in a crisis situation, improving on previous manual approaches. The method is
not only applicable in the context of disease outbreaks, but can be used to find
shared locations in movement data in other contexts as well.

---
