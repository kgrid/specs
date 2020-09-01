---
sidebar: 'auto'
sidebarDepth: 2
---

# KGrid Shelf API

## Introduction

Systems are being designed and built to help move biomedical knowledge into practice more quickly, more broadly, more accurately than ever before. These systems will rely on both long-term access and management of compound digital objects within digital repositories, and deployment and integration of these objects as services in a broad range of environments. We think of these two requirements as the "resource" perspective, and the "activation" perspective. This requires infrastructural standards and specifications that enable integration at scale. 
 
In the Knowledge Grid, Knowledge Objects (KOs) are represented as RDF resources and described by the Knowledge Object Implementation Ontology (KOIO). Knowledge Objects are managed in a simple repository which largely conforms to the [Linked Data Platform](https://www.w3.org/TR/ldp/) conceptual model. The Knowledge Object Common Packaging specification (KOCP), the KOIO, and the repository operations described here, taken together, form the specification of the "resource" perspective for the Knowledge Grid. 

For more on the "activation" perspective for the Knowledge Grid, and how KOs are deployed as services in a range of runtimes, see [KGRID Activation Spec](activation.md)

## Purpose

This API document applies to the Knowledge Object repository component, commonly referred to as the *Shelf*. 

The *Shelf* component also serves, in part, as a reference implementation of the Knowledge Object Common Packaging specification, and may be useful for implementers of additional components using Knowledge Objects in their own components. 

This document describes an API which exposes the compound digital objects comprising Knowledge Objects as a collection of resources. The API is a mostly RESTful HTTP interface, which abstracts the actual storage mechanism (filesystem, RDF store, graph or document datastore). Requests and responses in the Shelf API are mostly linked-data resources serielized as *json-ld* and binary files (the *Payload*).                  

## Status of this document

This document is draft. It has no official standing of any kind and does not represent the support or consensus of any standards organisation.

## Conformance

Sections marked as non-normative, authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Most everything else in this specification is normative.

The key words <conform>may</conform>, <conform>must</conform>, <conform>must not</conform>, <conform>should</conform>, and <conform>should not</conform> are to be interpreted as described in [RFC2119].

## Terminology

See [KOIO] for matching ontology terms....

### Knowledge Object

A collection of metadata containers and binary resources that together have a unique identifier (including version). In addition to the metadata, there are three required binaries: a service description, a deployment description, and one or more payload files. THe payload files implement one or more service endpoints described by the service description, and deployable using the information in the deployment description. See [Activation Spec] for details of the roles of the these files.

> KOIO term — koio:KnowledgeObject

## Overview of the API

#### The *Shelf API* is divided into three sub-APIs:

### Resource API

Basic access to Knowledge Objects and their sub-components. A thin layer over the basic CRUD operations for the underlying repository implementation (compound digital objects store). Resources are either linked-data containers (json-ld representations), service and deployment descriptions (json/yaml), or binary data streams (payload files). Resource paths follow the [KOCP]()  

### Import/Export API

Allows uploading and downloading compressed archives representing KOs and conforming to the [KOCP](). In addition the *Import/Export API* accepts a post with either a single URL pointing to a *manifest*, or a request body with a *manifest* (in `json` format), of external URLs from which multiple packaged KOs will be loaded.

### Resolver API

The *Resolver API* accepts an [Embedded ARK](https://17beta.top/en/ark_uri_scheme#rfc.section.4.1) and redirects to the local linked-data resource. CLients who can navigate to resources (via links) are correctly form direct links to resources <conform>should</conform> should use the *Resource API* directly. The *Resolver API* conforms to the [The ARK URI scheme](https://17beta.top/en/ark_uri_scheme) 

### Additional considerations and notes

* **Resource Identifiers** — By convention, the Knowledge Grid uses the `naan/name/{qualifier}` portion of the ARK (dropping the scheme) as the API route, and for the `@id` element in KO linked-data resource representations. This is convenient and aligns well with many underlying storage implementations (like the filesystem), as well as the [KOCP](packaging.md).
<p> This convention also gives a natural hierarchy and preserves the ARK `{qualifier}`, which is used to add a version string to the component path and additional component and variant paths as needed, usually, `/version{/optional/component/path/artifact.variant}`. See [ARK URI Scheme, Qualifier Part](https://tools.ietf.org/id/draft-kunze-ark-24.html#rfc.section.2.5) and [Ark Idendtifiers FAQ, What does "suffix passthrough" mean?](https://wiki.lyrasis.org/display/ARKs/ARK+Identifiers+FAQ#ARKIdentifiersFAQ-Whatdoes%22suffixpassthrough%22mean?) for more info on qualifiers.


* **Write Access** — <proposed>[proposed]</proposed> Write access may be disabled by an administrator for particular deployments of the *Shelf* repository. In that case:
  * For the *Import/Export API* the import operation will be disabled, and a status code `403 Forbidden` will be returned.  
  * For the *Resource API*, create, update, and delete operations on KOs (if implemented), and their sub-components, will be unavailable, and a status code `403 Forbidden` will be returned.

* **Access to Payload files** — <proposed>[proposed]</proposed> Access to payload files may be disabled by rule by an administrator for a particular deployment of the *Shelf* repository. In that case:
  * For the *Resource API* only the metadata, service and deployment description files will be available. Payload (and any other files) will not be available.
  * For the *Import/Export API* the export operation will be disabled and a status code of `403 Forbidden` will be returned.

* ***Manifest*** **handling** — In addition to the use of [manifests](#manifest-files) in the *Import/Export API* for loading multiple KOs at once, manifests may be used to load the shelf at start-up with predetermined sets of KOs. If the optional environment property `kgrid.shelf.manifest` is set to the URL(s) of a manifest, the Shelf will attempt to load those KOs into the currently configured CDO store. 
<p> See the [Shelf User's Guide]() for more info on configuring and running Shelf instances and the CDO stores available for persisting KOs.

* **Global identifiers** — The *Shelf API* does not use the ARK global identifier (metadata term: `dc:identifier`) outside of the Resolver API but all KOs, especially published KOs, are expected to have a persistent global identifier (currently only resolution of ARKs is supported). However, the Import/Export API does use the ARK on import to configure to map ARKs to/from local storage, and to package KOs in a standard, portable format on export.

* ***Shelf API*** **context path** — The *Shelf API* is meant to be incorporated into other components, and the context path is configurable at deployment via an environment property. THe examples below use `/kos` as the context path for all three APIs mentioned above. See the [Shelf User's Guide]() for more info.


## Resource API

### `GET /kos`
```
GET /kos HTTP/1.1
Accept: application/ld+json
```
Returns an array of knowledge object resources (i.e. json-ld metadata resource for each KO). This list is functionally the same as a [manifest](#manifest-files). See the [single KO resource endpoint](#get-naam-name-version) for more details on the returned resources.


```
HTTP/1.1 200
Content-Type: application/json
[{
"@id": "ipp/lowercholesterol/v0.0.3",
"@type": "koio:KnowledgeObject",
"identifier": "ark:/ipp/lowercholesterol/v0.0.3",
"title": "Lower Cholesterol Benefit and Risk adjustment",
"hasServiceSpecification": "service.yaml",
"hasDeploymentSpecification": "deployment.yaml",
"hasPayload": "netbenefit.js",
"@context": [
"http://kgrid.org/koio/contexts/knowledgeobject.jsonld"
]
},
{
"@id": "99999/fk4md04x9z/0.1.0",
"@type": "koio:KnowledgeObject",
"identifier": "ark:/99999/fk4md04x9z/0.1.0",
"title": "CPIC Genotype - Phenotype for CYP3A5",
"hasServiceSpecification": "service.yaml",
"hasDeploymentSpecification": "deployment.yaml",
"hasPayload": "phenotype.js",
"@context": [
"http://kgrid.org/koio/contexts/knowledgeobject.jsonld"
]
}]
```
To get the list of KOs as a *manifest*:
```
GET /kos HTTP/1.1
Accept: application/vnd.org.kgrid.manifest+json
```

```
HTTP/1.1 200
Content-Type: application/vnd.org.kgrid.manifest+json
[
{"@id": "ipp/lowercholesterol/v0.0.3"},
{"@id": "99999/fk4md04x9z/0.1.0"}
]
```

### `GET /kos/naam/name/version`
```
GET /kos/naam/name/version HTTP/1.1
Accept: application/ld+json
```
The minimal representation of KO contains basic metadata about the KO itself as a linked data representation. See the [KOCP](packaging.md) for required and recommended metadata expected for a KO (although different CDO stores may add additional elements). All KO resource representations include:
 * an `@id` element containing a relative URI resolvable against the current base URL for the *Shelf*
 * A `@context` element referencing the [KOIO](packaging.md#2-terminology) ontology, establishing the Knowledge Object specific vocabulary. The `@context` may contain an `@base` element against which relative URIs in the resource will be resolved.
 * a `@type` element with a value of `koio:KnowledgeObject`
 * a global identifier, `dc:identifier` with a value that is an Archival Resource Key ([ARK](https://n2t.net/e/ark_ids.html)), which expected to be resolvable at a top-level resolver (e.g. https://n2t.net), and against the local instance of the Shelf using the [Resolver API](#resolver-api)
 
 The KO linked-data representation <conform>should</conform> include three [KOIO]() structural elements `koio:hasServiceDescription`, `koio:hasDeploymentDescription`, and `koio:hasPayload`. These three elements taken together describe the required "activation" elements, but may not be required in some scenarios. The values of these elements are (usually relative) URIs resolvable against the base URL of the resource (but may be constrained by the configuration of the shelf as mentioned above).
 
 Finally, some Knowledge Grid components which expose the "Shelf API" may add additional link relations, for example a self link, a link to a demo of the object, an array if links to the request API for this object's endpoints/services etc.

```
HTTP/1.1 200
Content-Type: application/ld+json
{
"@id": "ipp/lowercholesterol/v2.3",
"@type": "koio:KnowledgeObject",
"identifier": "ark:/ipp/lowercholesterol/v2.3",
"title": "Lower Cholesterol Benefit and Risk adjustment",
"hasServiceSpecification": "service.yaml",
"hasDeploymentSpecification": "deployment.yaml",
"hasPayload": "netbenefit.js",
"@context": [ "http://kgrid.org/koio/contexts/knowledgeobject.jsonld"]
}
```

### GET /kos/naan/name
```
GET /kos/naam/name/version HTTP/1.1
Accept: application/ld+json, application/vnd.org.kgrid.manifest+json
```

```
HTTP/1.1 200
Content-Type: application/vnd.org.kgrid.manifest+json
```

```
[
{"@id": "ipp/lowercholesterol/v0.0.3"},
{"@id": "ipp/lowercholesterol/v2.1", "default": true}
]
```

The above format for a list of KOs is <proposed>proposed</proposed>. It corresponds to the <proposed>proposed</proposed> *manifest* format and is consistent with the *#IdOnly* `prefer` header. The `default:` parameter illustrates the scenario where a component adds use case specific elements to the manifest.

## Import/Export API

## Resolver API

## Manifest files

A manifest is simply a list of KOs represented as (minimally) an array of linked data resources, each identified by an `@id` element whose value is a URI. Absolute and relative URIs are permitted. Internally, the Shelf uses the Spring Resource abstraction which handles filesystem, URL, and classpath resources

## References

### [ARKIDSCHEME](https://tools.ietf.org/id/draft-kunze-ark-24.html) — Draft ARK Identifier Scheme
### [ARKSINTHEOPEN](https://wiki.lyrasis.org/display/ARKs/ARKs+in+the+Open+Project) — ARKs in the Open Project at Lyrarsis
### [ARKIDS](https://n2t.net/e/ark_ids.html) 
### [ARKIDSCHEME](https://tools.ietf.org/id/draft-kunze-ark-24.html) — Archival Resource Key (ARK) Identifiers
### [ARKURISCHEME](https://n2t.net/ark:21206/10015) — Draft ARK URI Scheme



