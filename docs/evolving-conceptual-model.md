## KO Model evolution

```mermaid
---
title: Original KO model (all terms are `koio`)
---
graph 
KO -.->|described by| metadata["additional metadata"]

KO --hasImplementation--> Implementation 
Implementation --hasServiceSpec--> ServiceSpec
Implementation --hasDeploymentSpec--> DeploymentInst
Implementation --hasPayload--> Payload -.-> ComputableKnowledgeResource
```

---

```mermaid
---
title: Original KO model (additional metadata)
---
graph 
KO -.->|described by| metadata["additional metadata"]
metadata --> descriptive --> ??
metadata --> administrative --> ???
metadata -.-> structural -.-> parts
KO --aggregates--> parts["[...]"] --hasImplementation--> Implementation 
Implementation --hasServiceSpec--> ServiceSpec
Implementation --hasDeploymentSpec--> DeploymentInst
Implementation --hasPayload--> Payload -.-> ComputableKnowledgeResource
```

### Notes
Predicates like `has...` in `koio` are of type `koio:hasPart` which is a `bfo:TransitiveProperty` and have inverses defined, e.g. `isPartOf...`. (Note that `dcterms` also defines a `dcterms:Relation` called `dcterms:hasPart`, the RO relations ontology defines `ro:hasPart` and `ro:partOf`, etc., if we don't want to create our own definition.)

The `hasServiceSpec` predicate seems to imply that the `Implementation` is a `Service` or provides a `Service`, but the `Service` term is not defined. But since the type of the predicate is `koio:hasPart` we would think that the `ServiceSpec` is "part of" the `Implementation`. Similar questions arise with `DeploymentInst`. In addition, the implication is that `Payload` is part of the `Implementation` but it is not clear that the three `has...` predicates exhaustively cover the parts of the `Implementation`.

(BTW, `Implementation` is not used in any of our existing KOs.)

Finally the major entities in the model all derive from `bfo:MaterialEntity`:

```mermaid
graph 
InformationArtifact --> Artifact --> bfo:MaterialEntity --> bfo:IndependantContinuant
KO -.-> InformationArtifact
ServiceSpec -.-> InformationArtifact
DeploymentInst -.-> InformationArtifact
Payload -.-> ComputableKnowledgeResource -.-> InformationArtifact
Implementation -.-> InformationArtifact
```

However, many or most of the structural, activation-related terms of interest in the evolving model (found in the IAO and SWO) are of type `iao:InformationContentEntity` (derived from `bfo:GenericallyDependentContinuant`). These are terms like `swo:SoftwareInterface`, `swo:Licence`, `iao:Algorithm`, `iao:SoftWareModule`, etc. Without a realignment to `iao:InformationContentEntity` we cannot use terms from these important ontologies in the evolved model. (See [Appendix A—the KO <--> KO package relationship](#appendix-athe-ko----ko-package-relationship)) for a possible solution to the problem of material instances.

It is worth a look at section VII. ORGANIZATION OF IAO-INTEL in [IAO-Intel  An Ontology of Information Artifacts in the Intelligence Domain](https://www.researchgate.net/publication/290324040_IAO-Intel_An_ontology_of_information_artifacts_in_the_intelligence_domain) for a discussion with examples if the relationship between Information Artifact, , , in the BFO and IAO. 

----

```mermaid
---
title: model (evolved)
---
graph 

KO --has part--> Service --> swo:SoftwareInterface -.-> iao:InformationContentEntity --> bfo:GenericallyDependentContinuant
swo:SoftwareInterface --iao:has part--> ServiceSpec -.-> iao:InformationContentEntity
Service --swo:implemented by--> iao:Software -.-> iao:InformationContentEntity
Service --ro:depends on--> Knowledge
iao:Software --ro:depends on--> iao:SoftwareModule
KO --has part--> Knowledge --> iao:Algorithm --swo:is implemented by--> iao:SoftwareModule -.-> iao:InformationContentEntity

KO -.-> iao:InformationContentEntity
```

----


```mermaid
---
title: model (additional metadata)
---
graph 

KO -.->|described by| metadata["additional metadata"]
metadata --> descriptive --> ??
metadata --> administrative --> ???
metadata -.-> structural -.-> parts

KO --> parts["[...]"] --has part--> Service & Knowledge
Service --> swo:SoftwareInterface
swo:SoftwareInterface --iao:has part--> ServiceSpec
Service --swo:implemented by--> iao:Software 
Service --ro:depends on--> Knowledge
iao:Software --ro:depends on--> iao:SoftwareModule
Knowledge --> iao:Algorithm --swo:is implemented by--> iao:SoftwareModule
```

```mermaid
---
title: Instance
---
graph 


KO --has part--> ServiceA & Knowledge1

swo:SoftwareInterfaceA --swo:implemented by--> iao:SoftwareModuleA
ServiceA --> swo:SoftwareInterfaceA --iao:has part--> ServiceSpecA
ServiceA --ro:depends on--> Knowledge1

Knowledge1 --> iao:Algorithm --swo:is implemented by--> iao:SoftwareMethod1 & iao:SoftwareMethod2

iao:SoftwareModuleA --ro:depends on--> iao:SoftwareMethod1

KO --has part--> ServiceB

ServiceB --ro:depends on--> Knowledge1
ServiceB --> swo:SoftwareInterfaceB --iao:has part--> ServiceSpecB
swo:SoftwareInterfaceB --swo:implemented by--> iao:SoftwareModuleB

iao:SoftwareModuleB --ro:depends on--> iao:SoftwareMethod1

```

### Notes

#### koio

KOIO is an ontology describing Knowledge Objects and their parts as they are implemented in the Knoweldge Grid (KGrid) reference platform.  As such, KOIO is subject to evolve as KGrid reference platform development evolves.

The primary overriding objective of developing and implementing KOIO is to describe Knowledge Objects and their parts in enough detail to achieve a degree  interoperability that is sufficient to enable Knowledge Objects to be incorporated into multiple platforms, including but not limited to, the KGrid reference platform

With the exception of several upper level classes from BFO and IAO, KOIO versions 1.X.X are limited to classes of material entities spanning Knowledge Objects, parts of Knowledge Objects, and Collections of Knowledge Objects.

KOs and their parts are classed as ***material entites*** but see [Basic Formal Ontology: Case Studies](https://philarchive.org/archive/OTTBBF) for an argument for KOs and their constituent parts as ***information content entities*** whose particular instances are born by a ***information bearing entity*** which is a ***material entity***

>generically dependent continuant – an entity that exists in virtue of the fact that there is at least one of what may be multiple copies; it is the content or the pattern that the multiple copies share.- 


#### Metadata Types
There are three main types of metadata: descriptive, administrative, and structural.

* Descriptive metadata enables discovery, identification, and selection of resources. It can include elements such as title, author, and subjects.

* Administrative metadata facilities the management of resources. It can include elements such as technical, preservation, rights, and use.

* Structural metadata, generally used in machine processing, describes relationships among various parts of a resource, such as chapters in a book.

### Terms
We are going to play with the [SWO](https://www.ebi.ac.uk/ols/ontologies/swo/terms?iri=http%3A%2F%2Fpurl.obolibrary.org%2Fobo%2FIAO_0000064&lang=en&viewMode=All&siblings=true) and IAO. SWP, for now, contributes "implements and "Implementation"

#### implements, isImplementedBy

a software module implements an algorithm, an algorithm isImplementBy a software module

----
#### Using [SIO](https://www.ebi.ac.uk/ols/ontologies/sio/terms?iri=http%3A%2F%2Fsemanticscience.org%2Fresource%2FSIO_000098&lang=en&viewMode=All&siblings=true) terms

N/A at this time

---

## Questions

* What does a knowledge object look like when the KO, the service/interface, and the implementation are separate? What if the "knowledge" implementation and the service implementation were different.
* What about a batch application and a web API in the same KO?

## Submodels

```mermaid
---
title: Collection model (only KO collections were modeled)
---
graph
KOCollection  -.->|schema:has member| KO
KOCollection -.-> Collection -.-> InformationArtifact
```
----

We could probably just use `schema:Collection` and `schema:hasPart` from the shema.org vocabulary

## Appendix A—the KO <--> KO package relationship

This may be best modeled as a material information bearer (KO package) for the information entity (KO). This would also potentially cover the multiple cases of a KO in a GitHub repository, a zipped file (our current package), an NPM package, a Python package.

[Basic Formal Ontology: Case Studies](https://philarchive.org/archive/OTTBBF)

"Many of the cases involve information. An information content entity is a generically dependent continuant that is about some entity. The term originates in the Information Artifact Ontology (IAO), an ontology that extends BFO. Because information content entity is a direct subclass of generically dependent continuant, an information content entity may generically depend on one or more material entities. One example is the content of a novel may be concretized by patterns of ink in multiple physical books or may be concretized by the digital patterns in different network servers; when this occurs, the novel (an information content entity) then generically depends on the physical books and network servers.

Although it is possible to define a subclass of information content entity as always having a unique serialization (e.g. as in the case of an International Standard Book Number ISBN, which would have a unique serialization such as “978-0-393-28857-5”), it is preferable in many cases to track information that can be common across serializations or translations, much as a proposition may be expressed by different sentences. One way to enable this is to treat the serialization as a property of the bearer of the information content entity, rather than the information content entity itself. To illustrate, Figure 3 depicts a measurement information content entity, its subject (an instance of process of walking), a material entity, and the measurement unit and string associated with that material entity. If the measurement information content entity was converted to kilometers, the instance of information content entity would remain the same, but would now also generically depend on a distinct instance of information bearing entity that would have text value “3.22 kilometers per hour”. Preliminaries in hand, we turn to the formalization of cases."

```mermaid
graph 
KoPackage --instance of--> KO

KoPackage --> iao:MaterialInformationBearer --> bfo:MaterialEntity --> bfo:IndependantContinuant

iao:InformationContentEntity -.-> iao:MaterialInformationBearer
KO --> iao:InformationContentEntity --> bfo:GenericallyDependentContinuant*

```

We have learned that the KO is not the packaged KO; there are multiple potential ways of packaging a KO for various uses.  


We still have to work out the identity of the `iao:InformationContentEntity` vs. the `iao:MaterialInformationBearer`

\* generically dependent continuant – an entity that exists in virtue of the fact that there is at least one of what may be multiple copies; it is the content or the pattern that the multiple copies share.

## Appendix B—`ro:hasPart` and compatible classes

[`ro:hasPart`](https://www.ebi.ac.uk/ols4/ontologies/ro/properties/http%253A%252F%252Fpurl.obolibrary.org%252Fobo%252FBFO_0000050?lang=en) definition

"Everything is part of itself. Any part of any part of a thing is itself part of that thing. Two distinct things cannot be part of each other."

But...

Parthood requires the part and the whole to have compatible classes: ... only an independent continuant can be part of an independent continuant; ... only a generically dependent continuant can be part of a generically dependent continuant.

The relationship between the KO (a generically dependent contiusnt) and the KO package (an independant continuant) is `ro:genericallyDependsOn`

## Appendix C—What is a "`Service`"?

BTW, modeling `Service` as a `swo:SoftwareInterface` allows for rich and nuanced description in the context of CBK. See [wiki:API](https://en.wikipedia.org/wiki/API), esp. *Examples* and *See Also* sections for an idea of the variety of interaction models. The subclass tree is potentially quite large but among those types initially mentioned in the SWO for `swo:SoftwareInterface` are:

#### software interface (9)
- application programming interface
- command-line interface
- graphical user interface (2)
  - desktop graphical user interface
  - web user interface
- web service (3)
  - JSON web service
  - REST service
  - SOAP service
