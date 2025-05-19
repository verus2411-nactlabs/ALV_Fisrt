sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/core/util/MockServer"
], function(BaseObject, MockServer){
	"use strict";

	const SERVICE_URL = "https://fake.host.com/localService/";

	const DemoMockServer = BaseObject.extend("sap.ui.comp.sample.smarttable.mockserver.DemoMockServer", {
		constructor : function(bTree, sMockdataPath) {
			BaseObject.apply(this);

			const sMockdataUrl = sap.ui.require.toUrl(sMockdataPath || "sap/ui/comp/sample/smarttable/mockserver");
			const oMockServer = new MockServer({
				rootUri: SERVICE_URL
			});

			this._oMockServer = oMockServer;

			oMockServer.simulate(sMockdataUrl + (!sMockdataPath && bTree ? "/orgHierarchy.xml" : "/metadata.xml"), sMockdataUrl);
			this.start();
		}

	});

	DemoMockServer.prototype.getServiceUrl = function() {
		return SERVICE_URL;
	};

	DemoMockServer.prototype.start = function() {
		this._oMockServer.start();
	};

	DemoMockServer.prototype.stop = function() {
		this._oMockServer.stop();
	};

	DemoMockServer.prototype.destroy = function(oView) {
		this.stop();
		if (oView) {
			var oModel = oView.getModel();
			oView.setModel();
			if (oModel) {
				oModel.destroy();
			}
		}
		this._oMockServer.destroy();
		this._oMockServer = null;
	};

	return DemoMockServer;
});
