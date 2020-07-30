# KGrid Shelf API

## Introduction

Systems are being designed and built to help move biomedical knowledge into practice more quickly, more broadly, more accurately than ever before. Those systems will rely on long-term access and management of compound digital objects within digital repositories, and deployment and integration of these objects as services in a broad range of environments. This requires infrastructural standards and specifications that enable integration at scale. We think of these two requirements as the "resource" perspective, and teh "activation" perspective.

In the Knowledge Grid, Knowledge Objects (KOs) are represented as RDF resources and described by the Knowledge Object Implementation Ontology (KOIO). Knowledge Objects are managed in a simple repository which largely conforms to the [Linked Data Platform](https://www.w3.org/TR/ldp/) conceptual model. The Knowledge Object Common Packaging specification (KOCP), the KOIO, and the repository operations described here, taken together, form the specification of the "resource" perspective for the Knowledge Grid. 

For more on the "activation" perspective for the Knowledge Grid, and how KOs are deployed as services in a range of runtimes, see [KGRID Activation Spec]()

## Purpose

This API document applies to the Knowledge Object repository component, commonly referred to as the *Shelf*. 

The *Shelf* component also serves, in part, as a reference implementation of the Knowledge Object Common Packaging specification, and may be useful for implementers of additional components using Knowledge Objects in their own comonents. 

This document describes an API which exposes the compound digital objects comprising Knowledge Objects as a collection of resources. The API is a mostly RESTful HTTP interface, which abstracts the actual storage mechanism (filesystem, RDF store, graph or document datastore). Requests and responses in the Shelf API are mostly linked-data resources serielized as *json-ld* and binary files (the *Payload*).                  

## Status of this document

This document is draft. It has no official standing of any kind and does not represent the support or consensus of any standards organisation.

## 1. Conformance

Sections marked as non-normative, authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Most everything else in this specification is normative.

The key words <conform>may</conform>, <conform>must</conform>, <conform>must not</conform>, <conform>should</conform>, and <conform>should not</conform> are to be interpreted as described in [RFC2119].

## 2. Terminology

See [KOIO] for matching ontology terms....

#### Knowledge Object:
A collection of metadata containers and binary resources that together have a unique identifier (including version). In addition to the metadata, there are three required binaries: a service description, a deployment description, and one or more payload files. THe payload files implement one or more service endpoints described by the service description, and deployable using the information in the deployment description. See [Activation Spec] for details of the roles of the these files.

> KOIO term — koio:KnowledgeObject

# Shelf API

#### The *Shelf* API is divided into three sub-APIs:

* **Resource API** — Basic access to Knowledge Objects and their sub-componnets. A thin layer over the basic CRUD operations for the underlying repositiory implementataion (compound digital objects store). Resources are either linked-data containers (json-ld represeetnations), service and deployment descriptions (json/yaml), or binary data streams (payload files). Resource paths follow the [KOCP]()  

* **Import/Export API** — Allows uploading and downloading compressed archives representing KOs and conforming to the [KOCP](). In addition the *Import/Export API* accepts a post with either a single URL pointing to a *maifest*, or a request body with a *manifest* (in `json` format), of external URLs from which multiple packaged KOs will be loaded.

* **Resolver API** — the *Resolver API* accepts an [Embedded ARK](The ARK URI scheme#rfc.section.4.1) and redirects to the local linked-data resource. CLients who can navigate to resources (via links) are correctly form direct links to resources <conform>should</conform> should use the *Resource API* directly. The *Resolver API* conforms to the [The ARK URI scheme](The ARK URI scheme) 

#### Additional considerations
* **Write Access** — <proposed>[proposed]</proposed> Write acces may be disbaled py an admintrator for particular deployments of the *Shelf* repository. In that case:
  * For the *Resource API*, create, update, and delete operations on KOs and their subcomponents will be unavailble and a status code `403 Forbidden` will be returned.
  * For the *Import/Export API* the import operation will disabled and a status code `403 Forbidden` will be returned.

* **Access to Payload files** — <proposed>[proposed]</proposed> Access to payload files may be disabled by rule by an administrator for a particular deployment of the *Shelf* repoistory. In that case:
 *  For the *Resource API* only the maetadata, service and deployment description files will be available.
  * For the *Import/Export API* the export operation will disabled and a status code `403 Forbidden` will be returned.

* *Manifest handling* — 

## Resource API

### List KO resources
```
GET /kos HTTP/1.1
Accept: application/json
```
Returns a list of knowledge object resources in a minimal representation

```
HTTP/1.1 200
Content-Type: application/json
[{
"@id": "ipp-lowercholesterol",
"@type": "koio:KnowledgeObject",
"identifier": "ark:/ipp/lowercholesterol",
"version": "v0.0.3",
"title": "Lower Cholesterol Benefit and Risk adjustment",
"contributors": "KGRID TEAM",
"desription": "Retrieve mortality rate set based on race, gender from CDC published life table.",
"citations": [
"https://www.uspreventiveservicestaskforce.org/Page/Name/uspstf-a-and-b-recommendations/"
],
"keywords": [
"Lower Cholesterol",
"Benefit",
"Risk",
"adjustment",
"ipp"
],
"hasServiceSpecification": "service.yaml",
"hasDeploymentSpecification": "deployment.yaml",
"hasPayload": "netbenefit.js",
"@context": [
"http://kgrid.org/koio/contexts/knowledgeobject.jsonld"
]
},
{
"@id": "99999-fk4md04x9z",
"@type": "koio:KnowledgeObject",
"identifier": "ark:/99999/fk4md04x9z",
"version": "0.1.0",
"title": "CPIC Genotype - Phenotype for CYP3A5",
"contributors": "KGRID TEAM",
"description": "KGrid CPIC guidelines Genotype to Phenotype for CYP3A5",
"citations": [
"https://link"
],
"keywords": [
"CPIC",
"CYP3A5",
"Genotype",
"Phenotype"
],
"hasServiceSpecification": "service.yaml",
"hasDeploymentSpecification": "deployment.yaml",
"hasPayload": "phenotype.js",
"@context": [
"http://kgrid.org/koio/contexts/knowledgeobject.jsonld"
]
}]
```
