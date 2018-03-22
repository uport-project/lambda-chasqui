# Diagrams for uPort::chasqui

#### Contents

- [Topic Seq](#topic-seq)
- [How to write diagrams](#how-to-write-diagrams)
- [How to generate diagrams](#how-to-generate-diagrams)

#### Topic Seq
![Topic Seq](./img/topic.seq.png)

#### How to write diagrams

Diagrams are written in [Plant UML](http://plantuml.com/) - full instructions on the website linked.

[Atom](https://atom.io) is a good editor for plant UML

 - [PlantUML language](https://atom.io/packages/language-plantuml) give you syntax highlighting
 - [PlantUML viewer](https://atom.io/packages/plantuml-viewer) lets you a preview of your diagram

[Visual Studio Code](https://code.visualstudio.com/) is another good option.

 - [PlantUML language](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml) syntax highlighting & preview


#### How to generate diagrams

Once you've written your diagram you'll want to display it somewhere for all to see!

To automatically generate the diagrams and add them to the readme file you need to run `diagram generate`

```sh
# You need to have graphviz installed to generate diagrams

# Instructions for windows
choco install javaruntime
choco install graphviz

# Add the path to your environment variables
# C:\Program Files (x86)\Graphviz2.38\bin

# Instructions for OSX
brew install graphviz

# Install diagrams globally
npm install -g diagram-cli

# init will create a /diagrams template folder
diagrams init

# make will generate all diagrams within the folder to pngs
diagrams make
```
