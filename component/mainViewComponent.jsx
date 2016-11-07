/**
 * Created by sqsun on 2015/9/22.
 */
define(['react', 'jsx!headerViewComponent', 'jsx!navViewComponent', 'react.backbone'], function(React, HeaderComp, NavComp) {
    var MainViewComponent = React.createBackboneClass({
        render: function() {
            var gcontCss = "comp-content";
            if(this.props.gclass){
                gcontCss = gcontCss + " " + this.props.gclass
            }
            return (
                <section className="flex view-warp">
                    <HeaderComp btnsConf={this.props.btnsConf} title={this.props.title} />
                    {this.props.scrollEvent &&
                        <section className={gcontCss} onScroll = {this.props.scrollEvent}>
                            {this.props.children}
                        </section>
                    }

                    {!this.props.scrollEvent &&
                        <section className={gcontCss}>
                            {this.props.children}
                        </section>
                    }
                    {/**<NavComp navClass={this.props.navClass} />*/}
                </section>
            );
        }
    });
    return MainViewComponent;
})